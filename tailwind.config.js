/** @type {import('tailwindcss').Config} */
export default {
  content: ['./Front/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        // Literary palette — see spec §10
        ivory: '#F7F4EE',
        paper: '#EEE9DF',
        surface: '#FFFFFF',
        ink: '#252321',
        'ink-soft': '#3A3633',
        'warm-gray': '#6E6A64',
        'warm-gray-light': '#9C978F',
        burgundy: '#743C45',
        'burgundy-deep': '#5E2F37',
        forest: '#52685A',
        'forest-deep': '#3F5246',
        gold: '#B59A65',
        'gold-deep': '#9C834F',
        // Semantic
        'sem-success': '#5A7A5F',
        'sem-warning': '#B58A4C',
        'sem-error': '#A4554E',
        'sem-info': '#5A7C9A',
        // Reader themes
        'sepia-bg': '#F4EAD8',
        'sepia-ink': '#433422',
        'darkreader-bg': '#1C1A17',
        'darkreader-surface': '#262320',
        'darkreader-ink': '#E8E2D6'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif']
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        '3xs': ['0.625rem', { lineHeight: '0.875rem' }]
      },
      letterSpacing: {
        editorial: '0.18em',
        wide2: '0.12em'
      },
      maxWidth: {
        content: '1240px',
        'content-wide': '1360px',
        reader: '72ch'
      },
      boxShadow: {
        soft: '0 1px 2px rgba(37,35,33,0.04), 0 8px 24px rgba(37,35,33,0.06)',
        'soft-lg': '0 2px 6px rgba(37,35,33,0.05), 0 18px 48px rgba(37,35,33,0.09)',
        cover: '0 10px 30px rgba(37,35,33,0.14)',
        'cover-hover': '0 22px 54px rgba(37,35,33,0.22)',
        ring: '0 0 0 1px rgba(37,35,33,0.06)'
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '26px'
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)'
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-up': { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'toast-in': { '0%': { opacity: '0', transform: 'translateY(16px) scale(0.98)' }, '100%': { opacity: '1', transform: 'translateY(0) scale(1)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease both',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'toast-in': 'toast-in 0.35s cubic-bezier(0.22,1,0.36,1) both'
      }
    }
  },
  plugins: []
};
