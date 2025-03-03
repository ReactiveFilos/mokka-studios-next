import { NextApiRequest, NextApiResponse } from "next";

import { mapToProfile } from "@/context/hooks/utils";

import { createServerApiClient } from "@/lib/serverAxios";

import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    // Get the server API client with authentication headers
    const serverAxios = createServerApiClient(req);

    const { username, password } = req.body;

    if (username && password) {
      // Call DummyJSON auth endpoint
      const response = await serverAxios.post("/auth/login", {
        username,
        password,
        expiresInMins: 60
      });

      // Extract tokens from response
      const { accessToken, refreshToken } = response.data;

      // Set tokens as HTTP-only cookies
      res.setHeader("Set-Cookie", [
        `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${60 * 60}`,
        `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}`
      ]);

      const profile = mapToProfile(response.data);

      return res.status(200).json({
        ...profile,
        message: "Authentication successful",
        isAuthenticated: true
      });
    } else {
      // No valid credentials provided
      return res.status(400).json({
        error: "Invalid credentials format",
        isAuthenticated: false
      });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 401;
      return res.status(statusCode).json({
        error: error.response?.data?.message || "Authentication failed",
        isAuthenticated: false
      });
    } else {
      return res.status(500).json({
        error: "Internal server error",
        isAuthenticated: false
      });
    }
  }
}