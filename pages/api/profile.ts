import { NextApiRequest, NextApiResponse } from "next";

import { mapToProfile } from "@/context/hooks/utils";

import { createServerApiClient } from "@/lib/serverAxios";

import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    // Get tokens from cookies
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    // Get the server API client with authentication headers
    const serverAxios = createServerApiClient(req);

    // Call DummyJSON auth endpoint to get user data
    const response = await serverAxios.get("/auth/me");

    // Format response as a Profile
    const profile = mapToProfile(response.data);

    return res.status(200).json(profile);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // If token is invalid or expired
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Clear invalid tokens
        res.setHeader("Set-Cookie", [
          "accessToken=; HttpOnly; Path=/; Max-Age=0",
          "refreshToken=; HttpOnly; Path=/; Max-Age=0"
        ]);
        return res.status(401).json({ error: "Authentication expired" });
      }

      return res.status(error.response?.status || 500).json({
        error: error.response?.data?.message || "Failed to fetch profile"
      });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}