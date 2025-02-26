import { usePagesRouter } from "@/context/hooks/usePagesRouter";
import { Profile } from "@/context/types/profile.type";

import AppIcon from "@/components/app/AppIcon";
import AppText from "@/components/app/AppText";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { ChevronsUpDown } from "lucide-react";

export function NavProfile({
  profile,
}: {
  profile: Profile
}) {
  const { isMobile } = useSidebar();

  const { pagesRouter } = usePagesRouter();

  const initials = profile.fullName.slice(0, 2).toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="width100 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              style={{ gap: "0.78125rem" }}>
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={profile.avatar} alt={initials} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <AppText size="mid" weight="lightBold">{profile.fullName}</AppText>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={profile.avatar} alt={initials} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <AppText size="mid" weight="lightBold">{profile.fullName}</AppText>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <AppIcon name="sparkles" size="1.65rem" />
                <AppText size="small">Upgrade to Pro</AppText>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={pagesRouter.account}>
                <AppIcon name="badge-check" size="1.65rem" />
                <AppText size="small">Account</AppText>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AppIcon name="credit-card" size="1.65rem" />
                <AppText size="small">Billing</AppText>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* Log out function */}
            <DropdownMenuItem>
              <AppIcon name="log-out" size="1.65rem" />
              <AppText size="small">Log out</AppText>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
