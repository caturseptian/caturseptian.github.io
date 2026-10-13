// Tailwind build for the static site (replaces the Play CDN so the page makes
// no third-party requests). Rebuild after changing classes:
//   npx tailwindcss@3.4.17 -c tailwind.config.js -i css/tailwind.src.css -o css/tailwind.css --minify
module.exports = {
  content: ["./index.html", "./openbadges/**/*.html", "./js/app.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Baloo 2", "system-ui", "sans-serif"],
      },
    },
  },
};
