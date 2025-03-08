import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/theme';

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f9f7fd",  // your custom background
        foreground: "#4a3d77",  // your custom foreground
        primary: {
          DEFAULT: "#7828c8",
        },
        secondary: {
          DEFAULT: "#5271ff",
        },
        success: {
          DEFAULT: "#23d98d",
        },
        warning: {
          DEFAULT: "#ffb100",
        },
        danger: {
          DEFAULT: "#ff4f4f",
        },
        content1: {
          DEFAULT: "#f2e8ff",
          foreground: "#000",
        },
        content2: {
          DEFAULT: "#e8daff",
          foreground: "#000",
        },
        focus: "#7828c8",
        overlay: "#000000",
      },
      screens: {
        sm: '640px',  // Adjust the sm breakpoint if necessary
      },
    },
  },
  screens: {
    sm: '640px',
  },
  darkMode: "class",  // Enabling dark mode with the "class" strategy
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#f9f7fd",
            foreground: "#4a3d77",
            primary: {
              DEFAULT: "#7828c8",
            },
            secondary: {
              DEFAULT: "#5271ff",
            },
            success: {
              DEFAULT: "#23d98d",
            },
            warning: {
              DEFAULT: "#ffb100",
            },
            danger: {
              DEFAULT: "#ff4f4f",
            },
            focus: "#7828c8",
            overlay: "#000000",
          },
        },
        dark: {
          colors: {
            background: "#1b1526",
            foreground: "#d0aaff",
            primary: {
              DEFAULT: "#9353d3",
            },
            secondary: {
              DEFAULT: "#637aff",
            },
            success: {
              DEFAULT: "#23d98d",
            },
            warning: {
              DEFAULT: "#ffca3a",
            },
            danger: {
              DEFAULT: "#ff6b6b",
            },
            focus: "#9353d3",
            overlay: "#ffffff",
          },
        },
      },
      layout: {
        disabledOpacity: "0.4",  // Adjusted opacity for disabled elements
      },
    }),
  ],
};

export default config;
