import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        brand: {
          leaf: "var(--color-brand-leaf)",
          earth: "var(--color-brand-earth)",
          cream: "var(--color-brand-cream)",
          ink: "var(--color-brand-ink)",
        },
      },
      borderRadius: {
        brand: "var(--radius-brand)",
      },
    },
  },
};

export default config;
