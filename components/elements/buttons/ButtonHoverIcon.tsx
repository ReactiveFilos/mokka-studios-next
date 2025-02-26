import { CSSProperties, useMemo, useState } from "react";

type ButtonHoverIconProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
};

export default function ButtonHoverIcon({
  children,
  className = "",
  onClick,
  style = {},
  disabled = false,
}: ButtonHoverIconProps) {
  const [hover, setHover] = useState<boolean>(false);

  const baseClassName = "flexRowCenter";

  const styles: CSSProperties = {
    ...style,
    padding: "0.625rem", // 10px
    borderRadius: "1rem",
  };

  const memoizedClassName = useMemo(() => {
    if (hover)
      return baseClassName + " backgroundColorPrimary";
    else return baseClassName;
  }, [hover]);

  return (
    <button
      className={`${memoizedClassName} ${className}`}
      onClick={onClick}
      style={styles}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={disabled}>
      {children}
    </button>
  );
}