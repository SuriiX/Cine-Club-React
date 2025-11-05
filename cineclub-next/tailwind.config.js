/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          100: '#ffe9ef',
          200: '#ffb3c8',
          400: '#ff668f',
          500: '#ff4d7d',
          600: '#ff335c',
          900: '#800020',
        },
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'spotlight': 'spotlight 6s ease-in-out infinite',
        'pop': 'pop 0.8s ease-out both',
        'marquee': 'marquee 18s linear infinite',
      },
      boxShadow: {
        'cinema': '0 20px 60px rgba(255, 80, 120, 0.25), 0 0 30px rgba(255, 120, 160, 0.25)',
      },
    },
  },
  plugins: [],
}