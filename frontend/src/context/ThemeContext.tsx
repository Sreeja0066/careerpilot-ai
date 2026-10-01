import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "careerpilot_theme";

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";
}

function getInitialTheme(): ThemePreference {
  const storedTheme = localStorage.getItem(
    STORAGE_KEY,
  ) as ThemePreference | null;

  if (
    storedTheme === "light" ||
    storedTheme === "dark" ||
    storedTheme === "system"
  ) {
    return storedTheme;
  }

  return "system";
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] =
    useState<ThemePreference>(getInitialTheme);

  const [resolvedTheme, setResolvedTheme] =
    useState<ResolvedTheme>(() => {
      const initialTheme = getInitialTheme();

      return initialTheme === "system"
        ? getSystemTheme()
        : initialTheme;
    });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);

    const updateTheme = () => {
      const nextTheme =
        theme === "system"
          ? getSystemTheme()
          : theme;

      setResolvedTheme(nextTheme);

      document.documentElement.dataset.theme =
        nextTheme;

      document.documentElement.style.colorScheme =
        nextTheme;
    };

    updateTheme();

    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    const handleChange = () => {
      updateTheme();
    };

    mediaQuery.addEventListener(
      "change",
      handleChange,
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleChange,
      );
    };
  }, [theme]);

  const setTheme = (nextTheme: ThemePreference) => {
    setThemeState(nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider",
    );
  }

  return context;
}