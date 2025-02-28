import { useTheme as useNextTheme } from "next-themes";

import React, { createContext, useContext, useEffect, useState } from "react";

import localforage from "localforage";

type ColorSchemeName = "light" | "dark";

type ContextProps = {
  selectedColorScheme: ColorSchemeName;
  handleChangeColorScheme: (colorScheme: ColorSchemeName) => void;
  handleToggleColorScheme: () => void;
};

type ProviderProps = {
  children: React.ReactNode;
};

const Context = createContext({} as ContextProps) as React.Context<ContextProps>;

const ThemeProvider = ({ children }: ProviderProps) => {
  const { setTheme } = useNextTheme();

  const themeStorage: LocalForage = localforage.createInstance({
    name: "themeNext",
  });

  const [selectedColorScheme, setSelectedColorScheme] = useState<ColorSchemeName>("light");

  const getStoredColorScheme = async () => {
    const storedColorScheme = await themeStorage.getItem("colorScheme");
    if (storedColorScheme === "light" || storedColorScheme === "dark") {
      setSelectedColorScheme(storedColorScheme as ColorSchemeName);
    } else if (!storedColorScheme) {
      setSelectedColorScheme("light");
      await themeStorage.setItem("colorScheme", "light");
    }
  };

  useEffect(() => {
    getStoredColorScheme();
  }, []);

  useEffect(() => {
    setTheme(selectedColorScheme);
    const body = document.querySelector("body");
    if (body) {
      if (selectedColorScheme === "dark") {
        body.classList.add("base-dark");
      } else {
        body.classList.remove("base-dark");
      }
    }
  }, [selectedColorScheme]);

  const handleChangeColorScheme = (colorScheme: ColorSchemeName) => {
    setSelectedColorScheme(colorScheme);
    themeStorage.setItem("colorScheme", colorScheme);
  };

  const handleToggleColorScheme = () => {
    const newColorScheme = selectedColorScheme === "light" ? "dark" : "light";
    handleChangeColorScheme(newColorScheme);
  };

  const contextValues: ContextProps = {
    selectedColorScheme,
    handleChangeColorScheme,
    handleToggleColorScheme,
  };

  return <Context.Provider value={contextValues}>{children}</Context.Provider>;
};

export const useTheme = () => useContext(Context);

export default ThemeProvider;