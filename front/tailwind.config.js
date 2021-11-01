module.exports = {
  purge: ['./src/components/**/*.{js,jsx,ts,tsx}', './src/pages/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
    },
  },
  variants: {
    opacity: ({ after }) => after(['disabled']),
    backgroundColor: ['hover'],
  },
  plugins: [],
};
