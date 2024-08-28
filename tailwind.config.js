/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        "screen-min": "100vmin",
        "screen-min-1/2": `${(100 * 1) / 2}vmin`,
        "screen-min-1/3": `${(100 * 1) / 3}vmin`,
        "screen-min-2/3": `${(100 * 2) / 3}vmin`,
        "screen-min-1/4": `${(100 * 1) / 4}vmin`,
        "screen-min-2/4": `${(100 * 2) / 4}vmin`,
        "screen-min-3/4": `${(100 * 3) / 4}vmin`,
        "screen-min-1/5": `${(100 * 1) / 5}vmin`,
        "screen-min-2/5": `${(100 * 2) / 5}vmin`,
        "screen-min-3/5": `${(100 * 3) / 5}vmin`,
        "screen-min-4/5": `${(100 * 4) / 5}vmin`,
      },
    },
  },
  plugins: [],
};
