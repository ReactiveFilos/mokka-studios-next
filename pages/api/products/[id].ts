import { NextApiRequest, NextApiResponse } from "next";

import { mapToProductWithCategoryId } from "@/context/types/product.type";

import { createServerApiClient } from "@/lib/serverAxios";

import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    // Get the server API client with authentication headers
    const serverAxios = createServerApiClient(req);

    // Handle different HTTP methods
    switch (req.method) {
      case "PUT":
      case "PATCH":
        // Update product
        const updateResponse = await serverAxios.put(`/products/${id}`, {
          title: req.body.title,
          description: req.body.description,
          price: req.body.price,
          thumbnail: req.body.image,
        });

        const updatedProduct = mapToProductWithCategoryId(req.body.categoryId, req.body.tags, updateResponse.data);

        return res.status(200).json(updatedProduct);
      case "DELETE":
        // Delete product
        const deleteResponse = await serverAxios.delete(
          `/products/${id}`
        );
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