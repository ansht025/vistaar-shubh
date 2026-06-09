import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#070b14',
        panel: '#0e1422',
        panelSoft: '#121a2d',
        primary: '#42f5d7'
      },
      boxShadow: {
        glass: '0 24px 80px rgba(0,0,0,0.35)'
      },
      backgroundImage: {
        gradientPremium: 'radial-gradient(circle at 12% -10%, #1f335d 0%, #0a1224 40%, #070b14 100%)'
      }
    }
  },
  plugins: []
};

export default config;

