/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'surface': '#121315',
        'surface-dim': '#121315',
        'surface-bright': '#38393b',
        'surface-container-lowest': '#0d0e10',
        'surface-container-low': '#1b1c1e',
        'surface-container': '#1f2022',
        'surface-container-high': '#292a2c',
        'surface-container-highest': '#343537',
        'on-surface': '#e3e2e5',
        'on-surface-variant': '#a1a1aa',
        'primary': '#ffb4ab',
        'primary-container': '#d71920',
        'on-primary-container': '#ffece9',
        'scada-red': '#d71920',
        'scada-green': '#22c55e',
        'scada-amber': '#f59e0b',
        'scada-cyan': '#06b6d4',
        'outline': '#ad8884',
        'outline-variant': '#5d3f3c',
        'border-dim': '#292a2c',
      },
      fontFamily: {
        'ndot': ['"Ndot 57"', '"Ndot-57"', '"NDot"', 'monospace'],
        'ndot-55': ['"Ndot 55"', '"Ndot-55"', '"NDot"', 'monospace'],
        'ndot-57': ['"Ndot 57"', '"Ndot-57"', '"NDot"', 'monospace'],
        'ntype': ['"NType 82"', '"Space Grotesk"', 'sans-serif'],
        'ntype-mono': ['"NType 82 Mono"', '"Space Mono"', 'monospace'],
        'heading': ['"NType 82"', '"Ndot 57"', '"NDot"', 'sans-serif'],
        'subheading': ['"NType 82 Mono"', '"Space Mono"', 'monospace'],
        mono: ['"NType 82 Mono"', '"Space Mono"', 'monospace'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
