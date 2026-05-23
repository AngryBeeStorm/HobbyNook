import { useMemo, useState } from "react";
import InspirationPanel from "../components/InspirationPanel";
import {
  inspirationImages,
  inspirationMoods,
  inspirationPalettes,
  inspirationWords,
} from "../data/sampleData";

function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomWords() {
  const shuffled = [...inspirationWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

function createRandomCard() {
  return {
    id: crypto.randomUUID(),
    image: getRandomItem(inspirationImages),
    words: getRandomWords(),
    palette: getRandomItem(inspirationPalettes),
    mood: getRandomItem(inspirationMoods),
  };
}

function InspirationPage() {
  const firstCard = useMemo(() => createRandomCard(), []);
  const [card, setCard] = useState(firstCard);
  const [savedCards, setSavedCards] = useState([]);

  function randomizeImage() {
    setCard((currentCard) => ({
      ...currentCard,
      image: getRandomItem(inspirationImages),
    }));
  }

  function randomizeWords() {
    setCard((currentCard) => ({
      ...currentCard,
      words: getRandomWords(),
    }));
  }

  function randomizePalette() {
    setCard((currentCard) => ({
      ...currentCard,
      palette: getRandomItem(inspirationPalettes),
    }));
  }

  function randomizeMood() {
    setCard((currentCard) => ({
      ...currentCard,
      mood: getRandomItem(inspirationMoods),
    }));
  }

  function randomizeAll() {
    setCard(createRandomCard());
  }

  function saveCard() {
    setSavedCards((currentCards) => [
      { ...card, id: crypto.randomUUID() },
      ...currentCards,
    ]);
  }

  return (
    <div className="page">
      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">Inspiration mode</p>
            <h2>Build an inspiration card</h2>
          </div>
        </div>

        <p className="section-description">
          Click the image, words, palette, or mood to randomize each part
          individually. Save cards you like into your inspiration treasure trove.
        </p>

        <InspirationPanel
          card={card}
          onRandomizeImage={randomizeImage}
          onRandomizeWords={randomizeWords}
          onRandomizePalette={randomizePalette}
          onRandomizeMood={randomizeMood}
          onRandomizeAll={randomizeAll}
          onSave={saveCard}
        />
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">Treasure trove</p>
            <h2>Saved inspirations</h2>
          </div>
        </div>

        {savedCards.length === 0 ? (
          <p className="empty-message">
            No saved inspiration yet. Save a card above to start collecting.
          </p>
        ) : (
          <div className="saved-inspiration-grid">
            {savedCards.map((savedCard) => (
              <article className="saved-card" key={savedCard.id}>
                <img src={savedCard.image} alt="" />

                <div>
                  <strong>{savedCard.mood}</strong>

                  <div className="mini-word-list">
                    {savedCard.words.map((word) => (
                      <span key={word}>{word}</span>
                    ))}
                  </div>

                  <div className="mini-palette">
                    {savedCard.palette.map((color) => (
                      <span key={color} style={{ backgroundColor: color }} />
                    ))}
                  </div>

                  <div className="button-row">
                    <button className="secondary-button">Start project</button>
                    <button className="secondary-button">Link to project</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default InspirationPage;