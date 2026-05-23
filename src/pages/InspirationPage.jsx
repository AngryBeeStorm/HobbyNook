import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import InspirationPanel from "../components/InspirationPanel";
import {
  inspirationImages,
  inspirationMoods,
  inspirationPalettes,
  inspirationWords,
} from "../data/sampleData";
import { fetchRandomUnsplashImage } from "../services/unsplashApi";

const PROJECTS_KEY = "craftspark-projects";

function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomWords() {
  const shuffled = [...inspirationWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

function getRandomWord(excludeWords = []) {
  const available = inspirationWords.filter(
    (word) => !excludeWords.includes(word)
  );

  return available.length > 0
    ? getRandomItem(available)
    : getRandomItem(inspirationWords);
}

function getRandomKeyword() {
  const first = getRandomItem(inspirationWords);
  const second = getRandomItem(
    inspirationWords.filter((word) => word !== first)
  );
  return `${first} ${second}`;
}

function createRandomCard() {
  return {
    id: crypto.randomUUID(),
    image: getRandomItem(inspirationImages),
    imageAlt: "Craft inspiration image",
    imageCredit: "Sample image",
    imageSourceUrl: "",
    words: getRandomWords(),
    palette: getRandomItem(inspirationPalettes),
    mood: getRandomItem(inspirationMoods),
  };
}

function InspirationPage() {
  const firstCard = useMemo(() => createRandomCard(), []);
  const [card, setCard] = useState(firstCard);
  const [savedCards, setSavedCards] = useState([]);
  const [keywords, setKeywords] = useState("crochet flowers");
  const [useCustomKeyword, setUseCustomKeyword] = useState(true);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  // --- State for linking to existing projects ---
  const [projects, setProjects] = useState([]);
  const [linkingCardId, setLinkingCardId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  useEffect(() => {
    // Load projects so we can populate the "Link to project" dropdown
    const savedProjects = localStorage.getItem(PROJECTS_KEY);
    if (savedProjects) setProjects(JSON.parse(savedProjects));
  }, []);

  async function fetchKeywordImage() {
    setIsLoadingImage(true);
    setImageError("");

    const keywordForFetch = useCustomKeyword ? keywords : getRandomKeyword();

    try {
      const imageData = await fetchRandomUnsplashImage(keywordForFetch);

      setCard((currentCard) => ({
        ...currentCard,
        image: imageData.imageUrl,
        imageAlt: imageData.imageAlt,
        imageCredit: imageData.imageCredit,
        imageSourceUrl: imageData.imageSourceUrl,
      }));
    } catch (error) {
      console.error(error);
      setImageError(
        "Could not load an online image. Using a local sample image instead."
      );

      setCard((currentCard) => ({
        ...currentCard,
        image: getRandomItem(inspirationImages),
        imageAlt: "Sample craft inspiration image",
        imageCredit: "Sample image",
        imageSourceUrl: "",
      }));
    } finally {
      setIsLoadingImage(false);
    }
  }

  function randomizeImage() {
    fetchKeywordImage();
  }

  function randomizeWords() {
    setCard((currentCard) => ({
      ...currentCard,
      words: getRandomWords(),
    }));
  }

  function randomizeWord(index) {
    setCard((currentCard) => {
      const newWords = [...currentCard.words];
      newWords[index] = getRandomWord(currentCard.words);

      return {
        ...currentCard,
        words: newWords,
      };
    });
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

  function updateMood(value) {
    setCard((currentCard) => ({
      ...currentCard,
      mood: value.slice(0, 30),
    }));
  }

  async function randomizeAll() {
    randomizeWords();
    randomizePalette();
    randomizeMood();
    await fetchKeywordImage();
  }

  function saveCard() {
    setSavedCards((currentCards) => [
      { ...card, id: crypto.randomUUID() },
      ...currentCards,
    ]);
  }

  // --- Function to save the link to local storage ---
  function confirmLinkProject(savedCard) {
    if (!selectedProjectId) return;

    const updatedProjects = projects.map((p) => {
      if (p.id === selectedProjectId) {
        const existingInspirations = p.inspirations || [];
        return { ...p, inspirations: [savedCard, ...existingInspirations] };
      }
      return p;
    });

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    
    // Close the dropdown menu
    setLinkingCardId(null);
    setSelectedProjectId("");
    alert("Inspiration successfully linked to project!");
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
          Enter keywords such as “crochet flowers”, “clay mushrooms”, or
          “pastel embroidery”, then fetch a random image to match the mood of
          your card.
        </p>

        <div className="keyword-search-card">
          <label htmlFor="inspiration-keywords">Image keywords</label>

          <div className="keyword-search-row">
            <input
              id="inspiration-keywords"
              type="text"
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              placeholder="e.g. crochet flowers, clay charms, pastel sewing"
              disabled={!useCustomKeyword}
            />

            <label className="keyword-toggle">
              <input
                type="checkbox"
                checked={useCustomKeyword}
                onChange={() => setUseCustomKeyword((current) => !current)}
              />
              Use custom keyword
            </label>

            <button
              className="primary-button"
              onClick={fetchKeywordImage}
              disabled={isLoadingImage}
            >
              {isLoadingImage ? "Loading..." : "Fetch image"}
            </button>
          </div>

          {imageError && <p className="form-error">{imageError}</p>}
        </div>

        <InspirationPanel
          card={card}
          isLoadingImage={isLoadingImage}
          onRandomizeImage={randomizeImage}
          onRandomizeWords={randomizeWords}
          onRandomizeWord={randomizeWord}
          onRandomizePalette={randomizePalette}
          onRandomizeMood={randomizeMood}
          onUpdateMood={updateMood}
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
                <img src={savedCard.image} alt={savedCard.imageAlt || ""} />

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

                  {savedCard.imageCredit && (
                    <p className="image-credit">
                      Image:{" "}
                      {savedCard.imageSourceUrl ? (
                        <a
                          href={savedCard.imageSourceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {savedCard.imageCredit}
                        </a>
                      ) : (
                        savedCard.imageCredit
                      )}
                    </p>
                  )}

                  {/* --- Interactive Linking Buttons --- */}
                  {linkingCardId === savedCard.id ? (
                    <div style={{ marginTop: "1.5rem", display: "grid", gap: "0.5rem" }}>
                      <select 
                        value={selectedProjectId} 
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)" }}
                      >
                        <option value="">Select a project...</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                      <div className="button-row">
                        <button className="primary-button" onClick={() => confirmLinkProject(savedCard)}>Save Link</button>
                        <button className="secondary-button" onClick={() => setLinkingCardId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="button-row" style={{ marginTop: "1.5rem" }}>
                      <Link className="primary-button" to="/add-project" state={{ inspirationCard: savedCard }}>
                        Start project
                      </Link>
                      <button className="secondary-button" onClick={() => setLinkingCardId(savedCard.id)}>
                        Link to project
                      </button>
                    </div>
                  )}
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