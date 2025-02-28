import { useMemo } from "react";

import AppDiv from "@/components/app/AppDiv";
import AppIcon from "@/components/app/AppIcon";
import ButtonHoverIcon from "@/components/elements/buttons/ButtonHoverIcon";
import ThemeToggle from "@/components/elements/ThemeToggle";
import NavTitle from "@/components/nav/NavTitle";
import { useSidebar } from "@/components/ui/sidebar";

export default function NavBar() {
  const { state, toggleSidebar } = useSidebar();

  const SideBarIcon = useMemo(() => (
    <AppIcon
      name={state === "collapsed" ? "panel-left-open" : "panel-right-open"}
      size="1.65rem"
    />
  ), [state]);

  return (
    <header
      className="width100 flexRowStartCenter backgroundColorSemiTransparent navBar">
      <ButtonHoverIcon onClick={toggleSidebar}>
        {SideBarIcon}
      </ButtonHoverIcon>
      <NavTitle />
      <AppDiv
        flexLayout="flexRowEndCenter"
        gap="1rem">
        <ThemeToggle />
      </AppDiv>
    </header>
  );
}