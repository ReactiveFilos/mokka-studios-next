import { CSSProperties, useMemo, useState } from "react";

import AppText from "@/components/app/AppText";

type ButtonPrimaryProps = {
  children?: React.ReactNode;
  className?: string;
  marginTop?: number | string;
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
};

export default function ButtonPrimary({
  children,
  className = "",
  marginTop = 0,
  onClick,
  style = {},
  disabled = false,
}: ButtonPrimaryProps) {
  const [hover, setHover] = useState<boolean>(false);

  const baseClassName = "width100 flexRowCenter borderFull backgroundColorOrange";

  const styles: CSSProperties = useMemo(() => ({
    ...style,
    padding: "0.625rem 1.5625rem", // 10px 25px
    borderRadius: "0.45rem",
    marginTop: marginTop,
    opacity: disabled ? 0.5 : 1,
  }), [disabled]);

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
      <AppText size="small" color="black" weight="lightBold">{children}</AppText>
    </button>
  );
}