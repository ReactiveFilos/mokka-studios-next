import { NextApiRequest } from "next";

import axios from "axios";

export function createServerApiClient(req: NextApiRequest) {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" }
  });

  // Add authentication header if token exists in cookies
  const accessToken = req.cookies.accessToken;
  if (accessToken) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  }

  return instance;
}