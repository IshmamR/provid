export const theme = {
  colors: {
    primary: {
      main: "#F01814",
      light: "#FDE9EA",
      dark: "#E7272D",
    },
    secondary: {
      main: "#F5F5F5",
      light: "#D9D9D9",
      dark: "",
    },

    body: "#F9F8FF",
    background: "#FFFFFF",
    highlight: "#EF555C",

    text: {
      title: "#000000",
      subtitle: "#262626",
      writing: "#525252",
      gray: "#8C8C8C",
      gray8: "#595959",
      grayLight: "#BFBFBF",
      white: "#FFFFFF",
      error: "#EF4F61",
      primary: "#EF4F61",
    },
    textBackground: {
      main: "#FFFFFF",
      light: "rgba(255, 255, 255, 0.65)",
      dark: "",
    },

    border: {
      main: "#D8D8D8",
      light: "#E8E8E8",
      lightest: "#FDE9EA",
      background: "",
      primaryLight: "#FAD4D5",
    },
    radio: {
      light: "#626262",
    },
    gray: {
      main: "rgba(0, 0, 0, 0.7)",
      light: "rgba(0, 0, 0, 0.5)",
      grayLight: "rgba(0, 0, 0, 0.08)",
      dark: "rgba(0, 0, 0, 0.9)",
      gray8: "#595959",
    },

    shadow: {
      main: "#E6F1F8",
    },

    error: {
      main: "#EF555C",
      light: "#FFEDEE",
      dark: "",
    },
    warning: {
      main: "#EF555C",
      light: "",
      dark: "",
    },
    success: {
      main: "#52C41A",
      light: "#F1FFEB",
      dark: "",
    },
    info: {
      main: "#FECA57",
      light: "",
      dark: "",
    },
  },
};

type TTheme = typeof theme;

export interface ITheme extends TTheme {
  additional: any;
}
