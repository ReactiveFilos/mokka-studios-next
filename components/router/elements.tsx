import { useRouter } from "next/router";

import { useTheme } from "@/context/theme";
import { useUser } from "@/context/platform";

import NextImage from "@/components/next/NextImage";

type RedirectPreviousRouteProps = {
  route?: string | null;
  onClick?: () => void;
};

export function RedirectPreviousRoute({ route = null, onClick }: RedirectPreviousRouteProps) {
  const router = useRouter();
  const { previousRoute } = useUser();
  const { selectedColorScheme } = useTheme();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    router.push(route || previousRoute || "/", undefined, { scroll: false });
  };

  return (
    <button onClick={handleClick}>
      <NextImage
        src={selectedColorScheme === "dark" ? "/icons/BackLight.svg" : "/icons/BackDark.svg"}
        size="1.5rem"
      />
    </button>
  );
}