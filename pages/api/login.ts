import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    const { email, password } = req.body;

    if (email === process.env.NEXT_PUBLIC_MOCK_API_EMAIL &&
      password === process.env.NEXT_PUBLIC_MOCK_API_PASSWORD) {

      const MOCK_API_ID = "/c/b45e-20de-45bc-b4c9";
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${MOCK_API_ID}`, { email, password });

      res.status(200).json(response.data);
    } else {
      return res.status(200).json(null);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      res.status(401).json({ error: "Authentication failed" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
