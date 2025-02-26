import dynamic from "next/dynamic";

import { useTheme } from "@/context/theme";

import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

interface IconProps extends LucideProps {
  name: keyof typeof dynamicIconImports;
}

const AppIcon = ({ name, color, ...props }: IconProps) => {
  const LucideIcon = dynamic(dynamicIconImports[name]);

  const { selectedColorScheme } = useTheme();
  return (
    <LucideIcon
      {...props}
      strokeWidth={1.25}
      color={color ? color : (selectedColorScheme === "dark" ? "white" : "black")}
    />
  );
};

export default AppIcon;