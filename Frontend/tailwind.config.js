/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],

  theme: {
    extend: {
      colors: {
        // Custom colors based on the style guide
        'soft-red': 'hsl(10, 79%, 65%)',
        'cyan': 'hsl(186, 34%, 60%)',
        'dark-brown': 'hsl(25, 47%, 15%)',
        'medium-brown': 'hsl(28, 10%, 53%)',
        'cream': 'hsl(27, 66%, 92%)',
        'very-pale-orange': 'hsl(33, 100%, 98%)',
      },
      fontFamily: {
        // Custom font from the style guide
        sans: ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        // Set base font size to 18px as specified in the style guide
        base: '18px',
      },
      spacing: {
        '4': '1rem',
        '5': '1.25rem',
      }
    }
  },
  plugins: [],
}
