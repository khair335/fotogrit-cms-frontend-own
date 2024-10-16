/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ftgreen: {
          200: '#59D282',
          400: '#2CF698',
          600: '#03E079',
          700: '#59D282',
          800: '#03bb65',
        },
        secondary: '#96B8B6',
        ftbrown: '#8F815E',
        ftyellow: '#FFB800',
        ftblue: '#0060AF',
        ftred: '#DD5858',
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },
    },
  },
  plugins: [],
};
