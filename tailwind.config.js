/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background:   '#050505',
        'bg-2':       '#0B0B0B',
        surface:      '#111111',
        'surface-2':  '#1a1a1a',
        border:       '#2b2b2b',
        'text-primary':   '#ffffff',
        'text-secondary': '#8a8a8a',
        'text-muted':     '#4a4a4a',
        light:        '#E5E5E5',
        blood:        '#8B0000',
      },
      fontFamily: {
        display: ['Bebas Neue', 'Anton', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        cinematic: '6px',
        hero:      '4px',
        wide:      '3px',
        label:     '4px',
      },
      transitionTimingFunction: {
        cinema: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
