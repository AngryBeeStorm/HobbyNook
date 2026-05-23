import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

const palettes = {
  cozy: {
    id: "cozy",
    name: "Cozy Clay",
    background: "#fbf4ec",
    surface: "#fffaf4",
    surfaceAlt: "#f4e2d2",
    text: "#33251f",
    mutedText: "#7b6659",
    primary: "#c46f4f",
    primaryDark: "#9f4f37",
    accent: "#e9b872",
    accentTwo: "#87986a",
    border: "#ead8c8",
  },
  lavender: {
    id: "lavender",
    name: "Lavender Studio",
    background: "#f7f1ff",
    surface: "#fffaff",
    surfaceAlt: "#eadff8",
    text: "#2f2638",
    mutedText: "#72657e",
    primary: "#9b72cf",
    primaryDark: "#7450a8",
    accent: "#f0a6ca",
    accentTwo: "#8ecae6",
    border: "#dfd0ee",
  },
  moss: {
    id: "moss",
    name: "Moss & Linen",
    background: "#f4f4ed",
    surface: "#fffdf6",
    surfaceAlt: "#e5ead7",
    text: "#2d3025",
    mutedText: "#69705a",
    primary: "#78866b",
    primaryDark: "#566148",
    accent: "#d6a157",
    accentTwo: "#b9c99a",
    border: "#dfe2cf",
  },
  candy: {
    id: "candy",
    name: "Candy Craft",
    background: "#fff3f6",
    surface: "#fffafd",
    surfaceAlt: "#ffe0eb",
    text: "#38252d",
    mutedText: "#7c5d68",
    primary: "#e56b9f",
    primaryDark: "#c14e7f",
    accent: "#ffc857",
    accentTwo: "#70d6ff",
    border: "#f2c9d7",
  },
};

export function ThemeProvider({ children }) {
  const [paletteId, setPaletteId] = useState(() => {
    return localStorage.getItem("craftspark-palette") || "cozy";
  });

  const activePalette = palettes[paletteId] || palettes.cozy;

  useEffect(() => {
    localStorage.setItem("craftspark-palette", paletteId);

    const root = document.documentElement;

    Object.entries(activePalette).forEach(([key, value]) => {
      if (key !== "id" && key !== "name") {
        root.style.setProperty(`--${key}`, value);
      }
    });
  }, [paletteId, activePalette]);

  return (
    <ThemeContext.Provider
      value={{
        palettes,
        paletteId,
        setPaletteId,
        activePalette,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}