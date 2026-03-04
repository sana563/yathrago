/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle at right, #bd4f6c, #d7816a)",
      },
      keyframes: {
        sunset: {
          "0%, 100%": { transform: "translateY(100%)" },
          "40%, 60%": { transform: "translateY(-50%)" },
        },
        sky: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 400%" },
        },
        fade: {
          "0%": { opacity: "1", transform: "translate(0,0)" },
          "100%": { opacity: "0", transform: "translate(-400px, -300px)" },
        },
      },
      animation: {
        sunset: "sunset 8s ease infinite",
        sky: "sky 12s ease infinite",
        fade: "fade 3s infinite",
      },
    },
  },
  plugins: [],
};
