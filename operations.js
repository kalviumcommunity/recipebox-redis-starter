// operations.js — YOUR WORK GOES HERE.
//
// Implement the four Redis operations for the RecipeBox app.
// Fill in every `// TODO`. Do NOT change the function names or what they return
// — the test file depends on them. Each function is only a line or two.

import { redis } from "./redisClient.js";
import { findRecipeInDB } from "./db.js";

// ─────────────────────────────────────────────────────────────────────────────
// Task 1 — Count recipe views
// ─────────────────────────────────────────────────────────────────────────────
// Every time a recipe page is opened, add 1 to its view count.
export async function incrementViews(recipeId) {
  // TODO:
  //   Use INCR on the key `views:${recipeId}` and return the new count (a Number).
  //   Hint:  return await redis.incr(`views:${recipeId}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Task 2 — Read a recipe through the cache (cache-aside)
// ─────────────────────────────────────────────────────────────────────────────
// The database is slow. Check Redis first; only go to the DB if it is not cached.
export async function getRecipe(recipeId) {
  // TODO:
  //   1. const key = `recipe:${recipeId}`;
  //   2. const cached = await redis.get(key);
  //        if (cached) return { source: "cache", recipe: JSON.parse(cached) };
  //   3. const recipe = await findRecipeInDB(recipeId);
  //        if (!recipe) return { source: "db", recipe: null };
  //   4. save it for next time with a 60-second expiry:
  //        await redis.set(key, JSON.stringify(recipe), "EX", 60);
  //      then return { source: "db", recipe };
}

// ─────────────────────────────────────────────────────────────────────────────
// Task 3 — Most-favourited leaderboard (sorted set)
// ─────────────────────────────────────────────────────────────────────────────
// Track favourites in a sorted set so we can read the top recipes instantly.
export async function addFave(recipeId) {
  // TODO:
  //   Add 1 to this recipe's score in the sorted set `trending:recipes`
  //   using ZINCRBY, and return the new score as a Number.
  //   Hint:  return Number(await redis.zincrby("trending:recipes", 1, recipeId));
}

export async function topRecipes(n) {
  // TODO:
  //   Return the top n recipe ids, highest score first, as an array of ids.
  //   Hint:  return await redis.zrevrange("trending:recipes", 0, n - 1);
}

// ─────────────────────────────────────────────────────────────────────────────
// Task 4 — One-time invite code
// ─────────────────────────────────────────────────────────────────────────────
// An invite code can be used at most once.
export async function issueInvite(code, ttlSeconds) {
  // TODO:
  //   Save the invite under `invite:${code}` with an expiry, in ONE atomic command:
  //     await redis.set(`invite:${code}`, "valid", "EX", ttlSeconds);
  //   Return the code.
}

export async function useInvite(code) {
  // TODO:
  //   Read AND delete the invite in one step with GETDEL:
  //     const raw = await redis.getdel(`invite:${code}`);
  //   If raw exists → return { ok: true };
  //   Otherwise     → return { ok: false, reason: "invalid_or_used" };
}
