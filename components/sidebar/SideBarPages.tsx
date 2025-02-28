import Link from "next/link";
import { useRouter } from "next/router";

import { sidebarRoutes } from "@/context/routes";

import AppText from "@/components/app/AppText";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function SideBarPages() {
  const { pathname } = useRouter();
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {sidebarRoutes.map((route) => (
          <SidebarMenuItem key={route.path}>
            <Link href={route.path}>
              <SidebarMenuButton
                isActive={pathname === route.path}>
                <AppText size="small" color="secondary" weight="bold">{route.name}</AppText>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}