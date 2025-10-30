import React from "react";

const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
  setThemeMode: (_) => {}, // Novo método para definir o modo do tema
  getThemeMode: () => "classic", // Novo método para obter o modo atual
  setPrimaryColorLight: (_) => {},
  setPrimaryColorDark: (_) => {},
  setAppLogoLight: (_) => {},
  setAppLogoDark: (_) => {},
  setAppLogoFavicon: (_) => {},
  setAppLogoBackgroundLight: (_) => {},
  setAppLogoBackgroundDark: (_) => {},
});

export default ColorModeContext;
