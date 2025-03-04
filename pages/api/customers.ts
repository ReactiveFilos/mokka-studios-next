import { NextApiRequest, NextApiResponse } from "next";

import { mapToCustomer, mapToCustomers } from "@/context/types/customer.type";

import { createServerApiClient } from "@/lib/serverAxios";

import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the server API client with authentication headers
    const serverAxios = createServerApiClient(req);

    // Handle different HTTP methods
    switch (req.method) {
      case "GET":
        const response = await serverAxios.get("/users?limit=0");

        // Explicitly map the data
        const customers = mapToCustomers(response.data.users);

        return res.status(200).json(customers);
      case "POST":
        // Create a new customer
        const createResponse = await serverAxios.post("/users/add", req.body);

        // Map the API response to our Customer type
        const newCustomer = mapToCustomer(createResponse.data);

        // Return the created customer with 201 Created status
        return res.status(201).json(newCustomer);
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