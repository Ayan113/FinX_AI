import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        slateNight: "#09111f",
        cyanGlow: "#4ee2ec",
        emeraldGlow: "#6ce8a7",
        sun: "#f9c66d",
        panel: "rgba(11, 24, 41, 0.72)"
      },
      boxShadow: {
        glass: "0 24px 80px rgba(15, 23, 42, 0.28)"
      },
      backgroundImage: {
        mesh:
          "radial-gradient(circle at top left, rgba(78, 226, 236, 0.18), transparent 28%), radial-gradient(circle at top right, rgba(108, 232, 167, 0.16), transparent 22%), radial-gradient(circle at bottom, rgba(249, 198, 109, 0.12), transparent 24%)"
      }
    }
  },
  plugins: []
};

export default config;
