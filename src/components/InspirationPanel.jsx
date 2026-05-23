function InspirationPanel({
  card,
  onRandomizeImage,
  onRandomizeWords,
  onRandomizePalette,
  onRandomizeMood,
  onRandomizeAll,
  onSave,
}) {
  return (
    <section className="inspiration-panel">
      <div className="inspiration-image-wrap" onClick={onRandomizeImage}>
        <img src={card.image} alt="" />
        <span>Click image to randomize</span>
      </div>

      <div className="inspiration-content">
        <div>
          <p className="section-kicker">Mood</p>
          <button className="text-randomizer" onClick={onRandomizeMood}>
            {card.mood}
          </button>
        </div>

        <div>
          <p className="section-kicker">Words</p>
          <div className="word-list" onClick={onRandomizeWords}>
            {card.words.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
        </div>

        <div>
          <p className="section-kicker">Palette</p>
          <div className="generated-palette" onClick={onRandomizePalette}>
            {card.palette.map((color) => (
              <span key={color} style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>

        <div className="button-row">
          <button className="secondary-button" onClick={onRandomizeAll}>
            Randomize all
          </button>
          <button className="primary-button" onClick={onSave}>
            Save to trove
          </button>
        </div>
      </div>
    </section>
  );
}

export default InspirationPanel;