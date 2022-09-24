import Seedrandom from "seedrandom";
import { seededRange, seededSample } from "./util";
import { pickUsers, type User } from "./users";

export const CURRENCIES = ["BTC", "GBP", "EUR", "JPY", "USD"];
export const DRINKS = ["coffee", "orange juice", "soda", "tea", "water"];
export const FOODS = ["hamburgers", "hot dogs", "pasta", "pizza", "salad"];

export interface Payment {
  id: string;
  date: string;
  sender: User;
  receiver: User;
  amount: string;
  currency: any;
  memo: string;
}

export function createRandomPayment() {
  // Seed a PRNG to use to generate all of our random data.  We seed it from the seconds
  // since the epoch, so that if multiple requests are made within the same clock second,
  // they'll get the same data.  Once we have this PRNG, it's very important that all random
  // data be generated from it.  We then regenerate our date object to be based on seconds
  // so that it stays consistent amongst requests within the same second.
  const nowMS = new Date();
  const epochSeconds = Math.round(nowMS.getTime() / 1000);
  const prng = Seedrandom(epochSeconds.toString());
  const now = new Date(epochSeconds * 1000);

  // Build our random data
  const users = pickUsers(prng);
  const food = seededSample(prng, FOODS);
  const drink = seededSample(prng, DRINKS);

  return {
    id: Math.round(prng.quick() * 1e16).toString(),
    date: now.toISOString(),
    sender: users[0],
    receiver: users[1],
    amount: seededRange(prng, 0, 1e4, 2).toString(),
    currency: seededSample(prng, CURRENCIES),
    memo: `${food} and ${drink}`,
  };
}
