import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        aquamarine: "#4ff8d2",
        "rich-black": "#011618",
        "brunswick-green": "#154F47",
      },
    },
  },
};

export default config;
