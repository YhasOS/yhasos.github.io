/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#F5E9E2',
          DEFAULT: '#E4CFCF',
          dark: '#D3AFAF',
        },
        secondary: {
          light: '#F9EFEF',
          DEFAULT: '#F0D9DC',
          dark: '#E3BDC7',
        },
        accent: {
          DEFAULT: '#C3A38A',
        },
        text: {
          DEFAULT: '#3D3D3D',
        },
      },
    },
  },
  plugins: [],
};