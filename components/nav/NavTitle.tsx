import { useRouter } from "next/router";

import { useMemo } from "react";

import AppText from "@/components/app/AppText";

export default function NavTitle() {
  const { pathname } = useRouter();

  const ROUTE_TITLES: Record<string, string> = {
    "/": "Home",
    "/account": "Account",
  } as const;

  const memoizedTitle = useMemo(() => {
    return (
      <AppText size="headingSmall" weight="lightBold" unbreakable>
        {ROUTE_TITLES[pathname] || ""}
      </AppText>
    );
  }, [pathname]);

  return memoizedTitle;
}