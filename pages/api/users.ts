import type { NextApiHandler } from "next";
import { getAllUsers } from "../../lib/users";

const handler: NextApiHandler = async (req, res) => {
  res.status(200).send({ data: getAllUsers() });
};

export default handler;
