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
  darkClay: {
    id: "darkClay",
    name: "Dark Clay",
    background: "#1a1410",
    surface: "#2a2218",
    surfaceAlt: "#3d2e23",
    text: "#f5ede2",
    mutedText: "#c4a895",
    primary: "#e8a882",
    primaryDark: "#d17a50",
    accent: "#f4c862",
    accentTwo: "#9ab88a",
    border: "#4d3f35",
  },
  darkPlum: {
    id: "darkPlum",
    name: "Dark Plum",
    background: "#17121f",
    surface: "#251e2f",
    surfaceAlt: "#3a2d45",
    text: "#e8dff5",
    mutedText: "#b8a8cc",
    primary: "#d4b8f0",
    primaryDark: "#b990d8",
    accent: "#f5a0d2",
    accentTwo: "#82d9f7",
    border: "#4a3d56",
  },
  darkMoss: {
    id: "darkMoss",
    name: "Dark Moss",
    background: "#131612",
    surface: "#1d221b",
    surfaceAlt: "#2d352a",
    text: "#e5ede2",
    mutedText: "#a4b39a",
    primary: "#a8d685",
    primaryDark: "#88b566",
    accent: "#e8c472",
    accentTwo: "#8dd9b8",
    border: "#414938",
  },
  darkSlate: {
    id: "darkSlate",
    name: "Dark Slate",
    background: "#0f1419",
    surface: "#1a1f2a",
    surfaceAlt: "#263544",
    text: "#e8eef7",
    mutedText: "#a8b4cc",
    primary: "#8bc3e0",
    primaryDark: "#6ba3c8",
    accent: "#f4c472",
    accentTwo: "#7ac9a3",
    border: "#384556",
  },
  redSunset: {
    id: "redSunset",
    name: "Red Sunset",
    background: "#fff0eb",
    surface: "#fff7f2",
    surfaceAlt: "#f0d1c1",
    text: "#4a1f18",
    mutedText: "#7b4a3c",
    primary: "#d9482b",
    primaryDark: "#a83b24",
    accent: "#f07a3b",
    accentTwo: "#b57559",
    border: "#e7c2b6",
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