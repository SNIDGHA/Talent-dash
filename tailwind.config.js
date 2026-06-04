/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#F7F7F7',
        foreground: '#222222',
        card: '#FFFFFF',
        border: '#EBEBEB',
        primary: '#FF5A5F', // Coral Red
        bodyText: '#484848',
        mutedText: '#717171',
        successGreen: '#008A05',
        warningOrange: '#FFB400',
        errorRed: '#D93025',
        hoverSurface: '#F2F2F2',
        dataBlue: '#0369A1', // Spec blue for Total Comp highlight
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-mono)', 'ui-mono-serif', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
