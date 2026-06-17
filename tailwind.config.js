export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        club: {
          50: '#F0F7F0',
          100: '#D4EAD4',
          200: '#A8D5A8',
          300: '#7CC17C',
          500: '#2D7A2D',
          700: '#1B5E20',
          900: '#0D3812'
        },
        accent: {
          yellow: '#FFD700',
          gold: '#FFC300'
        }
      }
    }
  },
  plugins: []
};
