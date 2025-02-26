
import { useMemo, useState } from "react";

import AppDiv from "@/components/app/AppDiv";
import AppIcon from "@/components/app/AppIcon";

type NextInputProps = {
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  clearFunction?: () => void;
}

export default function NextInput({
  className = "",
  value,
  onChange,
  placeholder,
  clearFunction,
}: NextInputProps) {
  const [hover, setHover] = useState<boolean>(false);

  const baseClassName = "borderFull";

  const memoizedClassName = useMemo(() => {
    if (hover)
      return baseClassName + " backgroundColorPrimary";
    else return baseClassName + " backgroundColor";
  }, [hover]);

  return (
    <AppDiv
      className={`${memoizedClassName} ${className}`}
      width100
      flexLayout="flexRowSpaceBetCenter"
      padding="0.425rem 1rem"
      gap={clearFunction ? "0.5rem" : "0"}
      borderRadius="0.45rem">
      <input
        className="fontSizeMid width100"
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />
      {clearFunction && value.length > 0 && (
        <AppDiv
          flexLayout="flexRowCenter"
          padding="0.25rem"
          borderRadius="50%"
          backgroundColorModal>
          <button
            className="flexRowCenter"
            onClick={clearFunction}>
            <AppIcon name="x" size="0.85rem" />
          </button>
        </AppDiv>
      )}
    </AppDiv>
  );
}
