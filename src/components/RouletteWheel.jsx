function RouletteWheel({ items, rotation, selectedItem, isSpinning, onSpin, canSpin }) {
  const fallbackColor = "var(--surfaceAlt)";

  // normalize rotation to 0-359 so labels can counter-rotate correctly
  const normalizedRotation = ((rotation % 360) + 360) % 360;

  const wheelBackground =
    items.length > 0
      ? `conic-gradient(${items
          .map((item, index) => {
            const start = (index / items.length) * 100;
            const end = ((index + 1) / items.length) * 100;
            return `${item.color} ${start}% ${end}%`;
          })
          .join(", ")})`
      : fallbackColor;

  return (
    <div className="roulette-stage">
      <div className="roulette-pointer">▼</div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => canSpin && onSpin && onSpin()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && canSpin && onSpin) onSpin();
        }}
        className={`real-wheel ${isSpinning ? "spinning" : ""} ${canSpin ? "clickable" : ""}`}
        style={{
          background: wheelBackground,
          transform: `rotate(${rotation}deg)`,
          cursor: canSpin ? "pointer" : "default",
        }}
      >
        {items.map((item, index) => {
          const angle = (360 / items.length) * index + 360 / items.length / 2;

          // Counter-rotate the label by the current wheel rotation so text stays upright.
          // We subtract both the sector angle and the normalized wheel rotation.
          const labelRotation = -angle - normalizedRotation;

          return (
            <span
              key={item.id}
              className="wheel-label"
              style={{
                transform: `rotate(${angle}deg) translateY(-135px) rotate(${labelRotation}deg)`,
              }}
            >
              {item.name}
            </span>
          );
        })}

        <div className="wheel-center">
          <strong
            style={{
              transform: `rotate(${-normalizedRotation}deg)`,
            }}
          >
            {isSpinning ? "Spinning..." : selectedItem?.name || "Spin"}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default RouletteWheel;