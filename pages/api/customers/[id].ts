import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid customer ID" });
  }

  try {
    // Handle different HTTP methods
    switch (req.method) {
      case "PUT":
      case "PATCH":
        // Update customer
        const updateResponse = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
          req.body,
          {
            headers: { "Content-Type": "application/json" }
          }
        );
        return res.status(200).json(mapCustomerData(updateResponse.data));

      case "DELETE":
        // Delete customer
        const deleteResponse = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`);
        return res.status(200).json({ id: Number(deleteResponse.data.id) });

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        error: error.response?.data || "Failed to process request"
      });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Helper function to map the DummyJSON user format to our Customer type
function mapCustomerData(user: any) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    address: {
      city: user.address.city,
      state: user.address.state,
      country: user.address.country
    }
  };
}