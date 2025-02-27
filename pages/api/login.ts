import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    const { email, password } = req.body;

    if (email === process.env.NEXT_PUBLIC_MOCK_API_MAIL &&
      password === process.env.NEXT_PUBLIC_MOCK_API_PASSWORD) {

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/c/bd55-1454-445c-884f`, { email, password });

      res.status(200).json(response.data);
    } else {
      return res.status(401).json({ message: "Authentication failed" });
    }
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
}
