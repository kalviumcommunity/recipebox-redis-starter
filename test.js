// test.js — runs your four functions and prints PASS / FAIL. GIVEN — do not edit.
import { redis } from "./redisClient.js";
import {
  incrementViews,
  getRecipe,
  addFave,
  topRecipes,
  issueInvite,
  useInvite,
} from "./operations.js";

let passed = 0;
let failed = 0;
function check(name, cond) {
  if (cond) { passed++; console.log("  PASS  " + name); }
  else { failed++; console.log("  FAIL  " + name); }
}

async function clean() {
  await redis.del(
    "views:1",
    "recipe:1",
    "recipe:999",
    "trending:recipes",
    "invite:VIP",
  );
}

async function main() {
  await clean();

  console.log("\nTask 1 — Count recipe views (INCR)");
  const v1 = await incrementViews("1");
  const v2 = await incrementViews("1");
  console.log("  views after two increments:", v2);
  check("first view returns 1", v1 === 1);
  check("second view returns 2", v2 === 2);
  check("the count is a Number", typeof v2 === "number");

  console.log("\nTask 2 — Read a recipe through the cache (cache-aside + TTL)");
  const r1 = await getRecipe("1");
  const r2 = await getRecipe("1");
  const rMissing = await getRecipe("999");
  const ttl = await redis.ttl("recipe:1");
  console.log("  first read source:", r1?.source, "| second read source:", r2?.source);
  check("first read comes from the DB", r1?.source === "db");
  check("first read returns the recipe", r1?.recipe?.title === "Lemon Pasta");
  check("second read comes from the cache", r2?.source === "cache");
  check("unknown recipe returns null recipe", rMissing?.recipe === null);
  check("cached recipe has a TTL between 1 and 60s", ttl > 0 && ttl <= 60);

  console.log("\nTask 3 — Most-favourited leaderboard (sorted set)");
  await addFave("1");
  await addFave("2");
  await addFave("2");
  await addFave("2");
  await addFave("3");
  const s = await addFave("2"); // recipe 2 now has 4
  const top2 = await topRecipes(2);
  console.log("  top 2:", JSON.stringify(top2));
  check("addFave returns the new score as a Number", s === 4);
  check("topRecipes returns an array of ids", Array.isArray(top2) && top2.length === 2);
  check("recipe 2 is ranked #1 (most faves)", top2[0] === "2");

  console.log("\nTask 4 — One-time invite code (SET EX + GETDEL)");
  await issueInvite("VIP", 60);
  const first = await useInvite("VIP");
  const second = await useInvite("VIP");
  console.log("  first use:", JSON.stringify(first), "| second use:", JSON.stringify(second));
  check("first use succeeds", first?.ok === true);
  check("second use fails (single-use)", second?.ok === false);

  console.log("\n" + "─".repeat(40));
  console.log(`  RESULT: ${passed} passed, ${failed} failed`);
  console.log("─".repeat(40));
  await redis.quit();
  if (failed === 0) console.log("✓ All tests passed!");
  else process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exit(1); });
