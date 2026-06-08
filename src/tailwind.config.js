export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Bricolage Grotesque", "system-ui", "sans-serif"],
        body: ["Instrument Sans", "system-ui", "sans-serif"],
      },
      colors: {
        bone: "#F4F1EA",
        paper: "#FBFAF6",
        ink: "#151917",
        graphite: "#2B312D",
        moss: "#334536",
        sage: "#DCE7D6",
        lime: "#C7F45A",
        clay: "#B58B6A",
        forest: "#18251d",
      },
      boxShadow: {
        soft: "0 18px 55px rgba(21,25,23,.08)",
        lift: "0 28px 90px rgba(21,25,23,.16)",
        glass: "0 22px 80px rgba(21,25,23,.18)",
      },
    },
  },
  plugins: [],
};
