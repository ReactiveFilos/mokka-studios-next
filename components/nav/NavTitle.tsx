import { useRouter } from "next/router";

import { useMemo } from "react";

import { ROUTE_TITLES } from "@/context/routes";

import AppText from "@/components/app/AppText";

export default function NavTitle() {
  const { pathname } = useRouter();

  const memoizedTitle = useMemo(() => {
    return (
      <AppText size="headingSmall" weight="lightBold" unbreakable>
        {ROUTE_TITLES[pathname] || ""}
      </AppText>
    );
  }, [pathname]);

  return memoizedTitle;
}