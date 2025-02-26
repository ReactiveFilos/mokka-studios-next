import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
