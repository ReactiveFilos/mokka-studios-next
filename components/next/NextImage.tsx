import Image from "next/image";

import { CSSProperties } from "react";

import { classNames } from "@/styles/theme/classNameUtils";

type NextImageProps = {
  src: string;

  size?: number | string;

  width?: number | string;
  height?: number | string;

  borderRadius?: number;

  contentFit?: "contain" | "cover";
  contentPosition?: "center" | "top" | "bottom" | "left" | "right";

  redBorder?: boolean;

  style?: CSSProperties;
};

export default function NextImage({
  src,
  size = null,
  width = null,
  height = null,

  borderRadius = null,

  contentFit = "contain",
  contentPosition = null,

  redBorder = false,
  style = {},
}: NextImageProps) {
  const styles: CSSProperties[] = [style];

  const classes = classNames(
    {
      "width100": width === "100%",
      "redBorder": redBorder,
    }
  );

  let sizes: string = "";
  let finalWidth: number = null;
  let finalHeight: number = null;

  if (size && typeof size === "string") {
    styles.push({ width: size, height: size });
    const finalValue = parseFloat(size.replace("rem", "")) * 16;
    finalWidth = finalValue;
    finalHeight = finalValue;
    sizes = `(max-width: 700px) ${parseFloat(size.replace("rem", "")) * 12}, ${finalValue}`;
  } else if (size && typeof size === "number") {
    styles.push({ width: `${size}px`, height: `${size}px` });
    finalWidth = size;
    finalHeight = size;
    sizes = `(max-width: 700px) ${(size * 12) / 16}, ${size}`;
  }

  if (width === "100%") {
    finalWidth = 1000;
    sizes = "(max-width: 700px) 100%, 100vw";
  } else if (width === "auto") {
    styles.push({ width: "auto" });
    finalWidth = 1000;
    sizes = "(max-width: 700px) 100%, 100vw";
  } else if (width && typeof width === "string") {
    styles.push({ width });
    const finalValue = parseFloat(width.replace("rem", "")) * 16;
    finalWidth = finalValue;
    sizes = `(max-width: 700px) ${parseFloat(width.replace("rem", "")) * 12}, ${finalValue}`;
  } else if (width && typeof width === "number") {
    styles.push({ width: `${width}px` });
    finalWidth = width;
    sizes = `(max-width: 700px) ${(width * 12) / 16}, ${width}`;
  }

  if (height === "100%") {
    finalHeight = 1000;
  } else if (height === "auto") {
    styles.push({ height: "auto" });
    finalHeight = 1000;
  } else if (height && typeof height === "string") {
    styles.push({ height });
    const finalValue = parseFloat(height.replace("rem", "")) * 16;
    finalHeight = finalValue;
  }
  else if (height && typeof height === "number") {
    styles.push({ height: `${height}px` });
    finalHeight = height;
  }

  if (borderRadius) styles.push({ borderRadius });

  if (contentFit) styles.push({ objectFit: contentFit });
  if (contentPosition) styles.push({ objectPosition: contentPosition });

  const mergedStyles = styles.reduce((acc, val) => ({ ...acc, ...val }), {});

  return (
    <Image
      className={classes}
      src={src}
      alt={src}
      width={finalWidth}
      height={finalHeight}
      placeholder="empty"
      sizes={sizes}
      style={mergedStyles}
    />
  );
}