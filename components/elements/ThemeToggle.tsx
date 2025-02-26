import { useTheme as useNextTheme } from "next-themes";

import { useMemo } from "react";

import { useTheme } from "@/context/theme";

import AppIcon from "@/components/app/AppIcon";
import ButtonHoverIcon from "@/components/elements/buttons/ButtonHoverIcon";

export default function ThemeToggle() {
  const { setTheme } = useNextTheme();

  const {
    selectedColorScheme,
    handleToggleColorScheme,
  } = useTheme();

  const ThemeIcon = useMemo(() => (
    <AppIcon
      name={selectedColorScheme === "dark" ? "sun" : "moon"}
      size="1.65rem"
    />
  ), [selectedColorScheme]);

  const toggleColorScheme = () => {
    setTheme(selectedColorScheme === "dark" ? "light" : "dark");
    handleToggleColorScheme();
  };

  return (
    <ButtonHoverIcon onClick={toggleColorScheme}>
      {ThemeIcon}
    </ButtonHoverIcon>
  );
}