import { useRouter } from "next/router";

import SafeProfileLayout from "@/layout/SafeProfileLayout";

import { useAuth } from "@/context/auth";
import { usePagesRouter } from "@/context/hooks/usePagesRouter";

import AppIcon from "@/components/app/AppIcon";
import AppText from "@/components/app/AppText";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton } from "@/components/ui/sidebar";

import { NavProfile } from "../profile/NavProfile";

export function AppSidebar() {
  const { pathname } = useRouter();
  const { pagesRouter } = usePagesRouter();

  const { profile } = useAuth();

  return (
    <Sidebar>
      <SafeProfileLayout>
        <SidebarHeader
          className="flexRowCenter"
          style={{
            maxHeight: "4.65rem",
            padding: "1rem 0.45rem 0.75rem 0.5rem",
          }}>
          <SidebarMenuButton
            size="lg"
            className="width100 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            style={{ gap: "0.78125rem" }}
            onClick={pagesRouter.index}
            isActive={pathname === "/"}>
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg"><AppIcon name="house" size="1.05rem" /></AvatarFallback>
            </Avatar>
            <AppText size="mid" weight="lightBold">Home</AppText>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent style={{ marginTop: "3.5rem" }} />
        <SidebarFooter className="width100">
          <NavProfile
            profile={profile}
          />
        </SidebarFooter>
      </SafeProfileLayout>
    </Sidebar>
  );
}
