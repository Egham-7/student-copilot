// @/themes/blocknote-theme.ts
import { Theme } from "@blocknote/mantine";

export const blockNoteTheme: { light: Theme; dark: Theme } = {
  light: {
    colors: {
      editor: {
        text: "var(--foreground)",
        background: "var(--background)",
      },
      menu: {
        text: "var(--popover-foreground)",
        background: "var(--popover)",
      },
      tooltip: {
        text: "var(--popover-foreground)",
        background: "var(--popover)",
      },
      hovered: {
        text: "var(--accent-foreground)",
        background: "var(--accent)",
      },
      selected: {
        text: "var(--primary-foreground)",
        background: "var(--primary)",
      },
      disabled: {
        text: "var(--muted-foreground)",
        background: "var(--muted)",
      },
      shadow: "var(--shadow)",
      border: "var(--border)",
      sideMenu: "var(--sidebar)",
      highlights: {
        gray: {
          text: "var(--muted-foreground)",
          background: "var(--muted)",
        },
        brown: {
          text: "var(--secondary-foreground)",
          background: "var(--secondary)",
        },
        red: {
          text: "var(--destructive)",
          background: "oklch(0.96 0.04 29.21)", // Lighter version of destructive
        },
        orange: {
          text: "var(--chart-5)",
          background: "oklch(0.95 0.04 60.02)",
        },
        yellow: {
          text: "var(--chart-4)",
          background: "oklch(0.95 0.04 84.99)",
        },
        green: {
          text: "var(--chart-1)",
          background: "oklch(0.95 0.04 41.68)",
        },
        blue: {
          text: "var(--chart-2)",
          background: "oklch(0.95 0.04 183.58)",
        },
        purple: {
          text: "var(--chart-3)",
          background: "oklch(0.95 0.04 211.35)",
        },
        pink: {
          text: "var(--primary)",
          background: "oklch(0.95 0.04 114.58)",
        },
      },
    },
    borderRadius: parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--radius"),
    ),
    fontFamily: "var(--font-sans)",
  },
  dark: {
    colors: {
      editor: {
        text: "var(--foreground)",
        background: "var(--background)",
      },
      menu: {
        text: "var(--popover-foreground)",
        background: "var(--popover)",
      },
      tooltip: {
        text: "var(--popover-foreground)",
        background: "var(--popover)",
      },
      hovered: {
        text: "var(--accent-foreground)",
        background: "var(--accent)",
      },
      selected: {
        text: "var(--primary-foreground)",
        background: "var(--primary)",
      },
      disabled: {
        text: "var(--muted-foreground)",
        background: "var(--muted)",
      },
      shadow: "var(--shadow)",
      border: "var(--border)",
      sideMenu: "var(--sidebar)",
      highlights: {
        gray: {
          text: "var(--muted-foreground)",
          background: "var(--muted)",
        },
        brown: {
          text: "var(--secondary-foreground)",
          background: "var(--secondary)",
        },
        red: {
          text: "var(--destructive)",
          background: "oklch(0.3 0.04 29.21)", // Darker version of destructive
        },
        orange: {
          text: "var(--chart-5)",
          background: "oklch(0.3 0.04 60.02)",
        },
        yellow: {
          text: "var(--chart-4)",
          background: "oklch(0.3 0.04 84.99)",
        },
        green: {
          text: "var(--chart-1)",
          background: "oklch(0.3 0.04 41.68)",
        },
        blue: {
          text: "var(--chart-2)",
          background: "oklch(0.3 0.04 183.58)",
        },
        purple: {
          text: "var(--chart-3)",
          background: "oklch(0.3 0.04 211.35)",
        },
        pink: {
          text: "var(--primary)",
          background: "oklch(0.3 0.04 114.58)",
        },
      },
    },
    borderRadius: parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--radius"),
    ),
    fontFamily: "var(--font-sans)",
  },
};
