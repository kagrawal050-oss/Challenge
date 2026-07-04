import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        mist: "#f6f8fb",
        compass: "#0f766e",
        sunset: "#f97316",
        orchid: "#7c3aed"
      },
      boxShadow: {
        soft: "0 18px 50px -28px rgba(23, 32, 42, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;
