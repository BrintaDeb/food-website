import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF5E00',
          'orange-hover': '#e05200',
          amber: '#FF8516',
          dark: '#1A1311',
          'dark-card': '#251C1A',
          cream: '#FFFDF9',
          border: '#E8E5E0',
          green: '#10B981',
          gold: '#FFB800'
        }
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'sans-serif']
      },
      boxShadow: {
        card: '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        float: '0 20px 40px -15px rgba(255, 94, 0, 0.25)',
        badge: '0 8px 24px -6px rgba(255, 133, 22, 0.35)'
      }
    }
  },
  plugins: []
};

export default config;
