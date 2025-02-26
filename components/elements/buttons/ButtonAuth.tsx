import { CSSProperties, useMemo, useState } from "react";

import { useTheme } from "@/context/theme";

import AppText from "@/components/app/AppText";
import NextImage from "@/components/next/NextImage";

type AuthProvider = "Google" | "GitHub";

type ButtonAuthProps = {
  provider?: AuthProvider;
  className?: string;
  marginTop?: number | string;
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
};

export default function ButtonAuth({
  provider,
  className = "",
  marginTop = 0,
  onClick,
  style = {},
  disabled = false,
}: ButtonAuthProps) {
  const { selectedColorScheme } = useTheme();
  const [hover, setHover] = useState<boolean>(false);

  const baseClassName = "width100 flexRowCenter borderFull";

  const styles: CSSProperties = {
    ...style,
    // padding: "0.625rem 1.5625rem", // 10px 25px
    padding: "0.625rem 0.85rem",
    borderRadius: "0.75rem",
    gap: "0.78125rem",
    marginTop: marginTop,
  };

  const memoizedClassName = useMemo(() => {
    if (hover)
      return baseClassName + " backgroundColorPrimary";
    else return baseClassName + " backgroundColor";
  }, [hover]);

  const memoizedProviderIcon = useMemo(() => {
    if (provider === "Google") return <NextImage src="/auth/Google.svg" size="1.65rem" />;
    else if (provider === "GitHub") return (
      <NextImage
        src={selectedColorScheme === "dark" ? "/auth/GitHubLight.svg" : "/auth/GitHubDark.svg"}
        size="1.65rem"
      />
    );
  }, [provider, selectedColorScheme]);

  return (
    <button
      className={`${memoizedClassName} ${className}`}
      onClick={onClick}
      style={styles}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled}>
      {memoizedProviderIcon}
      <AppText size="mid" weight="bold" unbreakable>{provider}</AppText>
      <span style={{ width: "0.85rem" }} />
    </button>
  );
}