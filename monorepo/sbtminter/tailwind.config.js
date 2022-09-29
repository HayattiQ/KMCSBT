/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        nftartokyo: "url('../public/images/bg_artokyo.png')",
      },
      backgroundPosition: {
        nftartokyo: 'center',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
