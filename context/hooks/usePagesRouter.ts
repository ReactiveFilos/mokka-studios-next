import { useRouter } from "next/router";

import { useCallback } from "react";

export const usePagesRouter = () => {
  const router = useRouter();

  const account = useCallback(() => {
    router.push("/account");
  }, [router]);

  return { pagesRouter: { account } };
};