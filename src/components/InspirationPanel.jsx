function InspirationPanel({
  card,
  onRandomizeImage,
  onRandomizeWords,
  onRandomizeWord,
  onRandomizePalette,
  onRandomizeMood,
  onUpdateMood,
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
          <div className="mood-row">
            <input
              className="mood-input"
              type="text"
              value={card.mood}
              onChange={(event) => onUpdateMood(event.target.value)}
              maxLength={30}
              placeholder="Type a mood"
            />
            <button
              type="button"
              className="secondary-button mood-randomizer"
              onClick={onRandomizeMood}
            >
              Randomize
            </button>
          </div>
        </div>

        <div>
          <p className="section-kicker">Words</p>
          <div className="word-list">
            {card.words.map((word, index) => (
              <span
                key={`${word}-${index}`}
                role="button"
                tabIndex={0}
                onClick={() => onRandomizeWord(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    onRandomizeWord(index);
                  }
                }}
              >
                {word}
              </span>
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