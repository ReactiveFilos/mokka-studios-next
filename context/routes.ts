export const ROUTE_TITLES: Record<string, string> = {
  "/": "Home",
  "/account": "Account",
  "/customers": "Customers",
  "/products": "Products",
  "/categories": "Categories",
  "/analytics": "Analytics",
} as const;

export const sidebarRoutes = [
  { name: "Customers", path: "/customers" },
  { name: "Products", path: "/products" },
  { name: "Categories", path: "/categories" },
  { name: "Analytics", path: "/analytics" },
];