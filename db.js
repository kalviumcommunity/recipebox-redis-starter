// db.js — a pretend "slow" recipe database. GIVEN — do not edit.
// In a real app this would be PostgreSQL or MongoDB. Here it is just an object,
// with a tiny delay so you can feel why caching reads in Redis is worth it.

const RECIPES = {
  "1": { id: "1", title: "Lemon Pasta", chef: "Rosa Lin" },
  "2": { id: "2", title: "Spiced Dal", chef: "Arjun Mehta" },
  "3": { id: "3", title: "Berry Pancakes", chef: "Claire Dubois" },
  "4": { id: "4", title: "Miso Ramen", chef: "Hiro Tanaka" },
  "5": { id: "5", title: "Green Curry", chef: "Nita Suki" },
};

export async function findRecipeInDB(recipeId) {
  await new Promise((r) => setTimeout(r, 120)); // pretend the DB is slow
  return RECIPES[recipeId] || null;
}
