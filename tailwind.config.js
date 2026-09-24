/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        MarxRed: {
          DEFAULT: '#B31B1B',
          deep: '#8B1018',
          light: '#C8102E',
          hover: '#9A1616',
          active: '#7A0E0E',
          subtle: 'rgba(179, 27, 27, 0.08)',
        },
        MarxBg: {
          DEFAULT: '#F8F9FA',
          page: '#F4F5F7',
          card: '#FFFFFF',
          banner: '#FFF1F0',
        },
        MarxGold: {
          DEFAULT: '#FFD700',
          hover: '#E6C200',
        },
        MarxCream: '#F7F4EE',
        MarxText: {
          primary: '#1F2937',
          secondary: '#4B5563',
          muted: '#9CA3AF',
          sidebar: '#FFFFFF',
          sidebarMuted: 'rgba(247, 244, 238, 0.75)',
        },
        MarxBorder: {
          DEFAULT: '#E5E7EB',
          red: '#FFA39E',
        },
        MarxSidebar: {
          DEFAULT: '#8B1018',
          active: 'rgba(255, 255, 255, 0.16)',
          hover: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
  plugins: [],
}
