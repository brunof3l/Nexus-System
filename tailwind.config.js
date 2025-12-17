/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Forçando nossa paleta de cores escuras
        nexus: {
          bg: '#0B1120',      // Fundo quase preto
          card: '#161F32',    // Fundo do cartão
          input: '#1E293B',   // Fundo do input
          border: '#334155',  // Bordas
          primary: '#0EA5E9', // Azul vibrante
        }
      }
    },
  },
  plugins: [],
}