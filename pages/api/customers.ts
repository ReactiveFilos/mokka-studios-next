import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users?limit=0`);

    // Explicitly map the data
    const customers = response.data.users.map((user: any) => ({
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
    }));

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