import { useTheme } from "../context/ThemeContext";

function PaletteSwitcher() {
  const { palettes, paletteId, setPaletteId } = useTheme();

  return (
    <div className="palette-switcher">
      <label htmlFor="palette">Color palette</label>

      <select
        id="palette"
        value={paletteId}
        onChange={(event) => setPaletteId(event.target.value)}
      >
        {Object.values(palettes).map((palette) => (
          <option key={palette.id} value={palette.id}>
            {palette.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PaletteSwitcher;