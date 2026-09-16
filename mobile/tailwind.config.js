/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF5E00',
          dark: '#E04800',
          light: '#FF8516',
          bg: '#FFF3EB'
        },
        curry: {
          charcoal: '#1A1311',
          cream: '#FFFDF9',
          border: '#E8E5E0',
          muted: '#8A817C',
          surface: '#F5F2EC'
        },
        veg: '#10B981',
        nonveg: '#EF4444'
      }
    }
  },
  plugins: []
};
