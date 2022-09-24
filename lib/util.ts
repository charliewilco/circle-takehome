import type { PRNG } from "seedrandom";

export const seededRange = (
  prng: PRNG,
  min: number,
  max: number,
  decimals?: number
) => {
  const rand = prng.quick() * (max - min) + min;
  return rand.toFixed(decimals);
};

// Seeded sample function.  Given a pre-seeded PRNG, randomly selects an element
// from the given array.
export const seededSample = (prng: PRNG, arr: any[]) =>
  arr[Math.floor(prng.quick() * (arr.length - 1))];
