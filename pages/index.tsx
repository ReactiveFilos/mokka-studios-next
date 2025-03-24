import Link from "next/link";

import SideBarRootLayout from "@/layout/SideBarRootLayout";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { ArrowRight, BarChartBig, LayoutGrid, ShoppingCart, UsersRound } from "lucide-react";

const navigationBlocks = [
  {
    title: "Customers",
    description: "Manage your customers",
    icon: UsersRound,
    path: "/customers",
    color: "bg-blue-500/10 text-blue-600",
    hoverColor: "group-hover:text-blue-600",
  },
  {
    title: "Products",
    description: "View and manage your products",
    icon: ShoppingCart,
    path: "/products",
    color: "bg-emerald-500/10 text-emerald-600",
    hoverColor: "group-hover:text-emerald-600",
  },
  {
    title: "Categories",
    description: "Organize your product categories",
    icon: LayoutGrid,
    path: "/categories",
    color: "bg-amber-500/10 text-amber-600",
    hoverColor: "group-hover:text-amber-600",
  },
  {
    title: "Analytics",
    description: "View insights and metrics",
    icon: BarChartBig,
    path: "/analytics",
    color: "bg-purple-500/10 text-purple-600",
    hoverColor: "group-hover:text-purple-600",
  },
  {
    title: "Tables",
    description: "View and manage your tables",
    icon: LayoutGrid,
    path: "/tables",
    color: "bg-amber-500/10 text-amber-600",
    hoverColor: "group-hover:text-amber-600",
  }
];

export default function Home() {
  return (
    <div className="w-full mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {navigationBlocks.map((block) => (
          <Link href={block.path} key={block.title}>
            <Card
              key={block.title}
              className="group cursor-pointer transition-all duration-200 hover:-translate-y-1 w-full">
              <CardHeader className="pb-3">
                <div className={`p-2 rounded-md w-fit ${block.color}`}>
                  <block.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <CardTitle className="text-lg mb-1">{block.title}</CardTitle>
                <CardDescription className="text-sm">{block.description}</CardDescription>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex items-center text-muted-foreground group-hover:text-primary">
                  <span className="text-sm font-medium">Navigate</span>
                  <ArrowRight className={`ml-1 h-4 w-4 ${block.hoverColor} group-hover:translate-x-1`} />
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

Home.getLayout = (page: React.ReactNode) => (
  <SideBarRootLayout>{page}</SideBarRootLayout>
);