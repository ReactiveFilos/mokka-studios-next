import { useRouter } from "next/router";

import { useCallback } from "react";

export const usePagesRouter = () => {
  const router = useRouter();

  const index = useCallback(() => {
    router.push("/");
  }, [router]);

  const login = useCallback(() => {
    router.push("/login");
  }, [router]);

  const customers = useCallback(() => {
    router.push("/customers");
  }, [router]);

  const account = useCallback(() => {
    router.push("/account");
  }, [router]);

  return { pagesRouter: { index, login, customers, account } };
};