import type { Payment } from "./lib/payments";
import type { User } from "./lib/users";
import { v4 as uuid } from "uuid";

type Listener = () => void;

let currentListeners: Listener[] | null = [];
let nextListeners = currentListeners;

export async function createPayment(
  sender: User,
  receiver: User,
  memo = "demo"
) {
  const nowMS = new Date();
  const epochSeconds = Math.round(nowMS.getTime() / 1000);
  const now = new Date(epochSeconds * 1000);
  const payment: Payment = {
    id: uuid(),
    amount: String(100),
    date: now.toISOString(),
    currency: "USD",
    sender,
    receiver,
    memo,
  };

  try {
    const response = await fetch("/v1/payments", {
      method: "POST",
      body: JSON.stringify(payment),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Payment didn't go through");
    }
    return payment;
  } catch (error) {
    console.error(error);
  }
}

export async function getRandomPayment() {
  const URL = process.env.BROWSER
    ? "/v1/payments"
    : "http://localhost:8080/payments";

  console.log("Getting random payment");
  try {
    const response = await fetch(URL);
    const data: { data: Payment } = await response.json();
    if (!response.ok) {
      throw new Error("Payment didn't go through");
    }

    return [data.data];
  } catch (error) {
    console.error(error);
  }
}

export function createPaymentStore(initialPayments: Payment[] = []) {
  const PAYMENTS = new Set(initialPayments);

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  function getSnapshot() {
    console.log("Payments getsnapshot");

    return Array.from(PAYMENTS);
  }

  function subscribe(listener: () => void) {
    let isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    console.log("Payments subscribe");
    return () => {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }

  function dispatch(nextPayment: Payment) {
    PAYMENTS.add(nextPayment);
    console.log("Payments dispatch", PAYMENTS);
    const listeners = (currentListeners = nextListeners);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  return {
    subscribe,
    getSnapshot,
    dispatch,
  };
}
