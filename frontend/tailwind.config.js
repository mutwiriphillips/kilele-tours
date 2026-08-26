/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pine: {
          DEFAULT: "#1F3D2E",
          dark: "#152A20",
          light: "#2E5641"
        },
        sand: {
          DEFAULT: "#D9C7A3",
          light: "#F7F4EE",
          dark: "#BFA97C"
        },
        brass: {
          DEFAULT: "#B08D57",
          light: "#C7A876",
          dark: "#8E6F3F"
        },
        ink: "#201C1A"
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Public Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      },
      backgroundImage: {
        "route-line": "linear-gradient(90deg, transparent 0%, currentColor 8%, currentColor 92%, transparent 100%)"
      }
    }
  },
  plugins: []
};
