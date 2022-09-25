import { useCallback, useEffect, useRef, useState } from "react";
import type { Payment } from "../lib/payments";
import type { User } from "../lib/users";
import {
  createPaymentStore,
  createPayment,
  getRandomPayment,
} from "../payments";
import { PaymentTable } from "./payment";

export const PaymentsUI = (props: { payment: Payment[]; users: User[] }) => {
  const didFire = useRef(false);

  const store = useRef(createPaymentStore(props.payment)).current;

  const [state, setState] = useState(store.getSnapshot());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(store.getSnapshot());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (didFire.current) {
      return;
    }
    getRandomPayment().then((payment) => {
      if (payment) {
        store.dispatch(payment[0]);
      }
      didFire.current = true;
    });

    return () => {
      console.log("Cleanup");
    };
  }, [store]);

  const create = useCallback(() => {
    const shuffled = props.users.sort(() => 0.5 - Math.random());
    const [sender, receiver] = shuffled.slice(0, 2);
    createPayment(sender, receiver).then((payment) => {
      if (payment) {
        store.dispatch(payment);
      }
    });
  }, [props, store]);

  return (
    <div>
      <button onClick={create}>Create Payment</button>

      {state.length > 0 && <PaymentTable payments={state} />}
    </div>
  );
};
