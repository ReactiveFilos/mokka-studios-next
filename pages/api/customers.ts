import { NextApiRequest, NextApiResponse } from "next";

import { mapToCustomers } from "@/context/hooks/utils";

import { createServerApiClient } from "@/lib/serverAxios";

import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    // Get the server API client with authentication headers
    const serverAxios = createServerApiClient(req);

    const response = await serverAxios.get("/users?limit=0");

    // Explicitly map the data
    const customers = mapToCustomers(response.data.users);

    return res.status(200).json(customers);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        error: "Failed to fetch customers"
      });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}