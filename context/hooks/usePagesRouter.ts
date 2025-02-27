import { useRouter } from "next/router";

import { useCallback } from "react";

export const usePagesRouter = () => {
  const router = useRouter();

  const login = useCallback(() => {
    router.push("/login");
  }, [router]);

  const index = useCallback(() => {
    router.push("/");
  }, [router]);

  const account = useCallback(() => {
    router.push("/account");
  }, [router]);

  return { pagesRouter: { login, index, account } };
};