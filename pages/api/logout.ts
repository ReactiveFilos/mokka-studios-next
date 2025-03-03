import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Clear authentication cookies
    res.setHeader("Set-Cookie", [
      "accessToken=; HttpOnly; Path=/; Max-Age=0",
      "refreshToken=; HttpOnly; Path=/; Max-Age=0"
    ]);

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to log out" });
  }
}