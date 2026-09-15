/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F5F2EC',
        charcoal: '#222222',
        blueSlate: '#4F5D75',
        coralGlow: '#EF8354',
        jetBlack: '#2D3142',
        silver: '#BFC0C0'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif']
      }
    }
  },
  plugins: [],
  safelist: [
    'bg-[#2D3142]',
    'text-[#F5F2EC]',
    'border',
    'border-[#EF8354]/40',
    'border-red-500/40',
    'shadow-2xl',
    'translate-y-4',
    'translate-y-0',
    'translate-y-2',
    'opacity-0',
    'opacity-100',
    'px-5',
    'py-3.5',
    'rounded-xl',
    'text-sm',
    'font-sans',
    'font-medium',
    'flex',
    'items-center',
    'gap-3',
    'transition-all',
    'duration-300',
    'transform',
    'pointer-events-auto',
    'pointer-events-none',
    'is-active',
    'is-revealed',
    'is-expanded',
    'is-open',
    'header-dark-theme',
    'mobile-nav-open',
    'scrolled'
  ]
};
