/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    './intro-template/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './plugins/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['Source Code Pro', 'monospace'],
        serif: ['Source Serif Pro', 'serif'],
        logo: ['Staatliches-Regular', 'monospace'],
      },
      colors: {
        dark: '#2E2B26',
        'semi-dark': '#7C7671',
        lightgrey: '#EFEFF0',
        white: '#FBFBFB',
        // 'accent-1': '#FAFAFA',
        // 'accent-2': '#EAEAEA',
        // 'accent-7': '#333',
        // success: '#0070f3',
        // cyan: '#79FFE1',
        // 'blue-500': '#2276FC',
        // 'yellow-100': '#fef7da',
      },
      // spacing: {
      //   28: '7rem',
      // },
      // letterSpacing: {
      //   tighter: '-.04em',
      // },
      // lineHeight: {
      //   tight: 1.2,
      // },
      fontSize: {
        // => https://tailwindremconverter.netlify.app/
        lg: ['3rem', '3rem'],
        md: ['1.469rem', '1.75rem'],
        sm: ['0.75rem', '1rem'],
        smmono: ['0.719rem', '1rem'],
        mdmono: ['1.406rem', '1.75rem'],
        head: ['1.75rem', '1.75rem'],
      },
      // boxShadow: {
      //   small: '0 5px 10px rgba(0, 0, 0, 0.12)',
      //   medium: '0 8px 30px rgba(0, 0, 0, 0.12)',
      // },
    },
  },
  plugins: [],
}
