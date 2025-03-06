import { NextApiRequest, NextApiResponse } from "next";

import { mapToCategories } from "@/context/types/category.type";
import { mapToProductsWithCategories, mapToProductWithCategoryId } from "@/context/types/product.type";

import { createServerApiClient } from "@/lib/serverAxios";

import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the server API client with authentication headers
    const serverAxios = createServerApiClient(req);

    // Handle different HTTP methods
    switch (req.method) {
      case "GET":
        // Fetch both products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          serverAxios.get("/products?limit=0"),
          serverAxios.get("/products/categories")
        ]);

        const categories = mapToCategories(categoriesResponse.data);
        const products = mapToProductsWithCategories(categories, productsResponse.data.products);

        return res.status(200).json(products);
      case "POST":
        // Create a new product
        const createResponse = await serverAxios.post("/products/add", {
          title: req.body.title,
          description: req.body.description,
          price: req.body.price,
          thumbnail: req.body.image,
        });

        // Map the API response to our Product type
        const newProduct = mapToProductWithCategoryId(req.body.categoryId, req.body.tags, createResponse.data);

        // Return the created product with 201 Created status
        return res.status(201).json(newProduct);
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