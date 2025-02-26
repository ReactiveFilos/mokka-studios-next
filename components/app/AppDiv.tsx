import { CSSProperties, useMemo } from "react";

import { classNames } from "@/styles/theme/classNameUtils";

type FlexLayout =
  | "flexRowCenter"
  | "flexRowSpaceBetCenter"
  | "flexRowStartCenter"
  | "flexRowEndCenter"
  | "flexRowStartTop"
  | "flexRowStartBottom"
  | "flexRowSpaceBetBottom"
  | "flexRowSpaceBetTop"
  | "flexColumnCenter"
  | "flexColumnStartLeft"
  | "flexColumnStartCenter"
  | "flexColumnEndCenter"
  | "flexColumnEndRight"
  | "flexColumnSpaceBetCenter"
  | "flexColumnSpaceBetLeft";

type AppViewProps = {
  children?: React.ReactNode;
  className?: string;

  flex1?: boolean;
  flexLayout?: FlexLayout;
  flexWrap?: boolean;

  width100?: boolean;
  height100?: boolean;

  width?: number | string;
  minWidth?: number | string;
  height?: number | string;

  gap?: number | string;

  padding?: number | string;
  paddingTop?: number | string;
  paddingBottom?: number | string;
  paddingLeft?: number | string;
  paddingRight?: number | string;
  paddingVertical?: number | string;
  paddingHorizontal?: number | string;

  margin?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
  marginVertical?: number | string;

  borderRadius?: number | string;
  borderRadiusTop?: number | string;
  borderRadiusBottom?: number | string;

  backgroundColor?: boolean;
  backgroundColorPrimary?: boolean;
  backgroundColorModal?: boolean;
  altBackgroundColor?: string;

  border?: null | "borderFull" | "borderBottomDots";
  altBorder?: CSSProperties;

  redBorder?: boolean;

  style?: CSSProperties;
};

export default function AppDiv({
  children,
  className = "",

  flex1 = false,
  flexLayout,
  flexWrap = false,

  width100 = false,
  height100 = false,

  width = null,
  minWidth = null,
  height = null,

  gap = null,

  padding = null,
  paddingTop = null,
  paddingBottom = null,
  paddingLeft = null,
  paddingRight = null,
  paddingHorizontal = null,
  paddingVertical = null,

  margin = null,
  marginTop = null,
  marginBottom = null,
  marginLeft = null,
  marginRight = null,
  marginVertical = null,

  borderRadius = null,
  borderRadiusTop = null,
  borderRadiusBottom = null,

  backgroundColor = false,
  backgroundColorPrimary = false,
  backgroundColorModal = false,
  altBackgroundColor = null,

  border = null,
  altBorder = null,

  redBorder = false,

  style = {},
}: AppViewProps) {
  const styles: CSSProperties[] = [style];

  const classes = classNames(
    className,
    {
      flex1,
      width100,
      height100,
      [flexLayout || ""]: !!flexLayout, // if flexLayout is not empty, use it
      flexWrap,
      backgroundColor,
      backgroundColorPrimary,
      backgroundColorModal,
      border,
      redBorder,
    }
  );

  if (width) styles.push({ width });
  else if (minWidth) styles.push({ minWidth });

  if (height) styles.push({ height });

  if (gap) styles.push({ gap });

  if (padding) styles.push({ padding });
  if (paddingTop) styles.push({ paddingTop });
  if (paddingBottom) styles.push({ paddingBottom });
  if (paddingLeft) styles.push({ paddingLeft });
  if (paddingRight) styles.push({ paddingRight });
  if (paddingHorizontal) styles.push({ paddingLeft: paddingHorizontal, paddingRight: paddingHorizontal });
  if (paddingVertical) styles.push({ paddingTop: paddingVertical, paddingBottom: paddingVertical });

  if (margin) styles.push({ margin });
  if (marginTop) styles.push({ marginTop });
  if (marginBottom) styles.push({ marginBottom });
  if (marginLeft) styles.push({ marginLeft });
  if (marginRight) styles.push({ marginRight });
  if (marginVertical) styles.push({ marginTop: marginVertical, marginBottom: marginVertical });

  if (borderRadius) styles.push({ borderRadius });
  else if (borderRadiusTop) styles.push({ borderTopLeftRadius: borderRadiusTop, borderTopRightRadius: borderRadiusTop });
  else if (borderRadiusBottom) styles.push({ borderBottomLeftRadius: borderRadiusBottom, borderBottomRightRadius: borderRadiusBottom });

  if (altBackgroundColor) styles.push({ backgroundColor: altBackgroundColor });

  if (altBorder) styles.push(altBorder);

  const mergedStyles = useMemo(() => styles.reduce((acc, val) => ({ ...acc, ...val }), {}), [styles]);

  return <div className={classes} style={mergedStyles}>{children}</div>;
}