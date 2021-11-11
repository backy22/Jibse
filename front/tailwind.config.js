module.exports = {
  purge: ['./front/components/**/*.{js,jsx,ts,tsx}', './front/pages/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'base-purple': '#200A3E',
        'gray-purple': '#493b61',
        'light-purple': '#3c2163'
      },
      screens: {
        'xs': '320px',
        
        'sm': '640px',
        // => @media (min-width: 640px) { ... }
  
        'md': '768px',
        // => @media (min-width: 768px) { ... }
  
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... },
  
        'xxl': '1920px',
        // => @media (min-width: 1280px) { ... }
        },
    },
  },
  variants: {
    opacity: ({ after }) => after(['disabled']),
    backgroundColor: ['hover'],
  },
  plugins: [],
};
