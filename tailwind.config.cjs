/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'scale-down-center':
          'scale-down-center 0.8s cubic-bezier(0.600, -0.280, 0.735, 0.045)   both',
        heartbeat: 'heartbeat 1.5s ease  infinite both',
      },
      keyframes: {
        'scale-down-center': {
          '0%': {
            transform: 'scale(1.5)',
          },
          to: {
            transform: 'scale(1)',
          },
        },
        heartbeat: {
          '0%': {
            transform: 'scale(1)',
            'transform-origin': 'center center',
            'animation-timing-function': 'ease-out',
          },
          '10%': {
            transform: 'scale(.91)',
            'animation-timing-function': 'ease-in',
          },
          '17%': {
            transform: 'scale(.98)',
            'animation-timing-function': 'ease-out',
          },
          '33%': {
            transform: 'scale(.87)',
            'animation-timing-function': 'ease-in',
          },
          '45%': {
            transform: 'scale(1)',
            'animation-timing-function': 'ease-out',
          },
        },
      },
    },
  },
  plugins: [],
};
