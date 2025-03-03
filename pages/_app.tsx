import { NextComponentType, NextPageContext } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import { NextThemeProvider } from "@/layout/NextThemeProvider";
import SafeProfileLayout from "@/layout/SafeProfileLayout";

import AuthProvider from "@/context/auth";
import Provider from "@/context/platform";
import ThemeProvider from "@/context/theme";
import ToastProvider from "@/context/toast";

import "@/styles/theme/base.css";
import "@/styles/container.css";
import "@/styles/flex.css";
import "@/styles/global.css";
import "@/styles/main.css";
import "@/styles/reset.css";

import "@/global.css";

type MyComponentType = NextComponentType<NextPageContext, any, {}> & {
  getLayout?: (page: JSX.Element) => JSX.Element;
};

export default function App({
  Component, pageProps }: AppProps) {

  const ComponentWithLayout = Component as MyComponentType;
  const getLayout = ComponentWithLayout.getLayout || ((page) => page);

  const router = useRouter();
  const [previousRoute, setPreviousRoute] = useState("/");

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setPreviousRoute(router.pathname);
    });
  }, [router]);

  return (
    <>
      <Head>
        <title>Next App</title>
        <link rel="icon" href="/icons/Ball.svg" />
        <link rel="apple-touch-icon" href="/icons/Ball.svg" />

        <meta name="description" content="Next App" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
        />
      </Head>

      <NextThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <SafeProfileLayout>
                <Provider previousRoute={previousRoute}>
                  {getLayout(<Component {...pageProps} />)}
                </Provider>
              </SafeProfileLayout>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </NextThemeProvider>
    </>
  );
}