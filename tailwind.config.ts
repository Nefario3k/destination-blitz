import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        main: {
          DEFAULT: "var(--bg_color)",
          1: "var(--bg_color1)",
          2: "var(--bg_color2)",
          3: "var(--bg_color3)",
          4: "var(--bg_color4)",
          5: "var(--bg_color5)",
          6: "var(--bg_color6)",
        },
        dark: {
          DEFAULT: "var(--text_light)",
          primary: "var(--primary_color)",
          primary2: "var(--primary_color2)",
          1: "var(--text_dark)",
          2: "var(--text_dark2)",
          3: "var(--text_dark3)",
          4: "var(--text_dark4)",
          5: "var(--text_dark5)",
          6: "var(--text_dark6)",
          7: "var(--text_dark7)",
          8: "var(--text_dark8)",
          9: "var(--text_dark9)",
          10: "var(--text_dark10)",
          11: "var(--text_dark11)",
        },
        bc: {
          DEFAULT: "var(--border_color)",
          1: "var(--border_color)",
          2: "var(--border_color2)",
        },
      },
      fontSize: {
        xs: "var(--text_xs)",
        sm: "var(--text_sm)",
        md: "var(--text_md)",
        lg: "var(--text_lg)",
        xl: "var(--text_xl)",
        p: "var(--text_p)",
      },
      fontFamily: {
        lobster: "Lobster, sans-serif !important",
        Lora: "Lora, sans-serif !important",
        Inter: "Inter, sans-serif !important",
        rhd: "'Red Hat Display', sans-serif !important",
        cg: "'Cormorant Garamond', sans-serif !important",
      },
    },
  },
  plugins: [],
};
