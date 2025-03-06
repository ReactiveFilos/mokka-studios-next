import { useAuth } from "@/context/auth";

import { NavProfile } from "@/components/profile/NavProfile";
import SideBarPages from "@/components/sidebar/SideBarPages";
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";

export function AppSidebar() {
  const { profile } = useAuth();
  return (
    <Sidebar>
      <SidebarContent
        style={{ marginTop: "5rem", padding: "0rem 0.15rem" }}>
        <SideBarPages />
      </SidebarContent>
      <SidebarFooter
        className="width100"
        style={{ padding: "0.5rem 0.45rem 0.5rem 0.5rem" }}>
        <NavProfile
          profile={profile}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
