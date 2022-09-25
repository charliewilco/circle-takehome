import type { NextApiHandler } from "next";
import _ from "lodash";
import { createRandomPayment, CURRENCIES } from "../../lib/payments";
import { isValidUser } from "../../lib/users";

const paymentIds: Record<string | number, boolean> = {};

const handler: NextApiHandler = async (req, res) => {
  if (req.method?.toLowerCase() === "get") {
    return res.send({ data: createRandomPayment() });
  }

  if (req.method?.toLowerCase() === "put") {
    const payment = req.body;

    if (!_.isString(payment.id)) {
      return res.status(400).json({ error: "Incorrectly formatted id" });
    }

    if (paymentIds[payment.id]) {
      console.log(`You retried the same payment id '${payment.id}'`);
      return res
        .status(409)
        .send({ error: "That payment id has already been used!" });
    }

    if (!Date.parse(payment.date)) {
      return res.status(400).send({ error: "Incorrectly formatted date" });
    }

    if (!isValidUser(payment.sender)) {
      return res.status(400).send({ error: "Incorrectly formatted sender" });
    }

    if (!isValidUser(payment.receiver)) {
      return res.status(400).send({ error: "Incorrectly formatted receiver" });
    }

    if (payment.sender.id === payment.receiver.id) {
      return res
        .status(400)
        .send({ error: "The sender and receiver must be different" });
    }

    if (
      !_.isString(payment.amount) ||
      !_.isNumber(parseFloat(payment.amount))
    ) {
      return res.status(400).send({ error: "Incorrectly formatted amount" });
    }

    if (!CURRENCIES.includes(payment.currency)) {
      return res.status(400).send({ error: "Incorrect formatted currency" });
    }

    // Don't bother doing any validation on the memo

    // Randomly decide if the payment succeeds or fails.
    if (Math.random() < 0.5) {
      const error = `Payment with id '${payment.id}' failed!  Please try again later.`;
      console.log(error);
      return res.status(503).send({ error });
    } else {
      // Record that the payment id has been used.
      paymentIds[payment.id] = true;
      const error = `Payment succeeded: ${JSON.stringify(payment)}`;
      console.log(error);
      return res.status(201).send({
        error,
      });
    }
  }
};

export default handler;
