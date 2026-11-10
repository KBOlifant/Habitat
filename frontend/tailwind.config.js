/** @type {import('tailwindcss').Config} */
module.exports = {
  // 'class' avoids NativeWind's web error "Cannot manually set color scheme, as dark mode is
  // type 'media'". The app is dark-only and uses no `dark:` variants.
  darkMode: 'class',
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}