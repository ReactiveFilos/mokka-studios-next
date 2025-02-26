import { useRouter } from "next/router";

import { useCallback } from "react";

export const usePagesRouter = () => {
  const router = useRouter();

  const account = useCallback(() => {
    router.push("/account");
  }, [router]);

  const login = useCallback(() => {
    router.push("/login");
  }, [router]);

  return { pagesRouter: { account, login } };
};