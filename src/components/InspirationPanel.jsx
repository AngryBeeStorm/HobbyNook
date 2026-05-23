function InspirationPanel({
  card,
  isLoadingImage = false,
  onRandomizeImage,
  onRandomizeWords,
  onRandomizeWord,
  onRandomizePalette,
  onRandomizeMood,
  onUpdateMood,
  onRandomizeAll,
  onSave,
}) {
  function handleKeyboardAction(event, callback) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  }

  return (
    <section className="inspiration-panel">
      <div
        className={`inspiration-image-wrap ${
          isLoadingImage ? "image-loading" : ""
        }`}
        onClick={!isLoadingImage ? onRandomizeImage : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(event) =>
          handleKeyboardAction(event, () => {
            if (!isLoadingImage) {
              onRandomizeImage();
            }
          })
        }
      >
        <img src={card.image} alt={card.imageAlt || "Inspiration image"} />

        {card.imageCredit && (
          <p className="image-credit image-credit-overlay">
            Image: {card.imageSourceUrl ? (
              <a href={card.imageSourceUrl} target="_blank" rel="noreferrer">
                {card.imageCredit}
              </a>
            ) : (
              card.imageCredit
            )}
          </p>
        )}
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
          <div className="section-title-row">
            <p className="section-kicker">Words</p>

            <button
              type="button"
              className="tiny-action-button"
              onClick={onRandomizeWords}
            >
              Randomize all words
            </button>
          </div>

          <div className="word-list">
            {card.words.map((word, index) => (
              <span
                key={`${word}-${index}`}
                role="button"
                tabIndex={0}
                title="Click to randomize this word"
                onClick={() => onRandomizeWord(index)}
                onKeyDown={(event) =>
                  handleKeyboardAction(event, () => onRandomizeWord(index))
                }
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="section-kicker">Palette</p>

          <div
            className="generated-palette"
            onClick={onRandomizePalette}
            role="button"
            tabIndex={0}
            title="Click to randomize palette"
            onKeyDown={(event) =>
              handleKeyboardAction(event, onRandomizePalette)
            }
          >
            {card.palette.map((color) => (
              <span key={color} style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>

        <div className="button-row">
          <button
            type="button"
            className="secondary-button"
            onClick={onRandomizeAll}
            disabled={isLoadingImage}
          >
            {isLoadingImage ? "Randomizing..." : "Randomize all"}
          </button>

          <button type="button" className="primary-button" onClick={onSave}>
            Save to trove
          </button>
        </div>
      </div>
    </section>
  );
}

export default InspirationPanel;