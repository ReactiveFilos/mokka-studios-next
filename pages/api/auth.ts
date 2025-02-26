import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { username, password } = req.body;
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { username, password });

    const token = response.data.token;

    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
    );

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
}
