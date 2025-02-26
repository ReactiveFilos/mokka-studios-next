import { CSSProperties, useMemo } from "react";

import { classNames } from "@/styles/theme/classNameUtils";

type TextSize =
  | "small"
  | "mid"
  | "headingSmall"
  | "headingMid";

type TextColor =
  | "default"
  | "black"
  | "white"
  | "secondary"
  | "secondaryDark"
  | "secondaryLight"
  | "red";

type TextWeight =
  | "regular"
  | "bold"
  | "lightBold";

type AppTextProps = {
  children: React.ReactNode;
  className?: string;

  size?: TextSize;
  color?: TextColor;
  weight?: TextWeight;
  altFontSize?: number;

  center?: boolean;
  lineHeight?: number | string;

  altColor?: string;
  underlined?: boolean;

  marginTop?: number | string;
  marginLeft?: number | string;
  marginBottom?: number | string;

  truncate?: boolean;
  unbreakable?: boolean;

  redBorder?: boolean;

  style?: CSSProperties;
};

export default function AppText({
  children,
  className = "",

  size = "small",
  color = "default",
  weight = "regular",

  altFontSize,
  altColor,

  center = false,
  lineHeight,

  underlined = false,

  marginTop = 0,
  marginLeft = 0,
  marginBottom = 0,

  truncate = false,
  unbreakable = false,

  redBorder = false,

  style = {},
}: AppTextProps) {
  const styles: CSSProperties[] = [style];

  const classes = classNames(
    className,
    {
      [`fontSize${size.charAt(0).toUpperCase() + size.slice(1)}`]: true,
      [`font${weight.charAt(0).toUpperCase() + weight.slice(1)}`]: true,
      [color === "default" ? "colorText" : `colorText${color.charAt(0).toUpperCase() + color.slice(1)}`]: true,
      "textUnderlined": underlined,
      "textAlignCenter": center,
      "textTruncate": truncate,
      "textUnbreakable": unbreakable,
      redBorder,
    }
  );

  if (lineHeight) styles.push({ lineHeight });
  if (altColor) styles.push({ color: altColor });
  if (marginTop) styles.push({ marginTop });
  if (marginLeft) styles.push({ marginLeft });
  if (marginBottom) styles.push({ marginBottom });

  const mergedStyles = useMemo(() => styles.reduce((acc, val) => ({ ...acc, ...val }), {}), [styles]);

  return <p className={classes} style={mergedStyles}>{children}</p>;
}