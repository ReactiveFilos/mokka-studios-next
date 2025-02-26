import { CSSProperties, useMemo, useState } from "react";

import AppText from "@/components/app/AppText";

type ButtonSecondaryProps = {
  children?: React.ReactNode;
  className?: string;
  marginTop?: number | string;
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
};

export default function ButtonSecondary({
  children,
  className = "",
  marginTop = 0,
  onClick,
  style = {},
  disabled = false,
}: ButtonSecondaryProps) {
  const [hover, setHover] = useState<boolean>(false);

  const baseClassName = "flexRowCenter borderFull";

  const styles: CSSProperties = {
    ...style,
    padding: "0.625rem 1.5625rem", // 10px 25px
    borderRadius: "0.45rem",
    marginTop: marginTop,
  };

  const memoizedClassName = useMemo(() => {
    if (hover)
      return baseClassName + " backgroundColorPrimary";
    else return baseClassName + " backgroundColor";
  }, [hover]);

  return (
    <button
      className={`${memoizedClassName} ${className}`}
      onClick={onClick}
      style={styles}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled}>
      <AppText size="small" weight="lightBold">{children}</AppText>
    </button>
  );
}