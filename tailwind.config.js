/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        spice: {
          brown: '#8B5E3C',
          brownLight: '#A67C52',
          brownDark: '#6B4423',
          sage: '#7A9E7E',
          sageLight: '#A3C4A6',
          sageDark: '#5C7A5F',
          saffron: '#E8A838',
          saffronLight: '#F0C060',
          cinnamon: '#C1584F',
          cinnamonLight: '#D47972',
          cream: '#FDF8F3',
          creamDark: '#F5EDE0',
          charcoal: '#3D2B1F',
          charcoalLight: '#5A4030',
        },
      },
      fontFamily: {
        display: ['Lora', 'Georgia', 'serif'],
        body: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'flip': 'flip 0.6s ease-in-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
