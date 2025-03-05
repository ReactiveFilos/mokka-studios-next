import { NextApiRequest, NextApiResponse } from "next";

import { mapToCategories } from "@/context/types/category.type";

import { createServerApiClient } from "@/lib/serverAxios";

import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the server API client with authentication headers
    const serverAxios = createServerApiClient(req);

    // Handle different HTTP methods
    switch (req.method) {
      case "GET":
        const response = await serverAxios.get("/products/categories");

        // Explicitly map the data
        const categories = mapToCategories(response.data);

        return res.status(200).json(categories);
      default:
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        error: error.response?.data || "Failed to process request",
      });
    } else {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}