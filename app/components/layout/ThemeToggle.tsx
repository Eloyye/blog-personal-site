import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { getPreferredTheme, setDocumentTheme, themeStorageKey } from "~/lib/theme";

import type { Theme } from "~/lib/theme";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
    setDocumentTheme(preferredTheme);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <Button
      aria-label={`Switch to ${nextTheme} theme`}
      size="icon-sm"
      title={`Switch to ${nextTheme} theme`}
      type="button"
      variant="ghost"
      onClick={() => {
        window.localStorage.setItem(themeStorageKey, nextTheme);
        setTheme(nextTheme);
        setDocumentTheme(nextTheme);
      }}
    >
      <HugeiconsIcon icon={theme === "dark" ? Sun03Icon : Moon02Icon} size={18} />
    </Button>
  );
};

export { ThemeToggle };
