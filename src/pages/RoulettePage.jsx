import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import RouletteWheel from "../components/RouletteWheel";
import { defaultRouletteItems } from "../data/sampleData";

const STORAGE_KEY = "craftspark-roulette-items";

function getSavedRouletteItems() {
  const savedItems = localStorage.getItem(STORAGE_KEY);

  if (!savedItems) {
    return defaultRouletteItems;
  }

  try {
    const parsedItems = JSON.parse(savedItems);

    if (!Array.isArray(parsedItems)) {
      return defaultRouletteItems;
    }

    return parsedItems;
  } catch {
    return defaultRouletteItems;
  }
}

function RoulettePage() {
  const [items, setItems] = useState(getSavedRouletteItems);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemColor, setNewItemColor] = useState("#c46f4f");
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const canSpin = items.length >= 2 && !isSpinning;

  const selectedItemIndex = useMemo(() => {
    if (!selectedItem) return -1;
    return items.findIndex((item) => item.id === selectedItem.id);
  }, [items, selectedItem]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function spinRoulette() {
    if (!canSpin) return;

    const sliceAngle = 360 / items.length;
    const extraSpins = 360 * 5;

    // Pick a random landing offset within one slice to keep results unpredictable
    const randomTinyOffset = Math.random() * (sliceAngle * 0.9) - sliceAngle * 0.45;

    // We'll rotate so that some slice middle ends up under the pointer at 0deg.
    // Choose a random target index to land on.
    const targetIndex = Math.floor(Math.random() * items.length);
    const targetMiddle = targetIndex * sliceAngle + sliceAngle / 2;

    // pointerCorrection rotates the wheel so that the chosen slice middle lines up at 0deg
    const pointerCorrection = 360 - targetMiddle;

    const newRotation = rotation + extraSpins + pointerCorrection + randomTinyOffset;

    setIsSpinning(true);
    setSelectedItem(null);
    setRotation(newRotation);

    window.setTimeout(() => {
      // Determine final selected index based on the final rotation value.
      const finalRot = ((newRotation % 360) + 360) % 360; // 0-359

      // The wheel's coordinate that lands at the pointer is (360 - finalRot) % 360
      const pointerAngle = (360 - finalRot) % 360;

      // Convert pointerAngle to an index
      const landedIndex = Math.floor(pointerAngle / sliceAngle) % items.length;

      setSelectedItem(items[landedIndex]);
      setIsSpinning(false);
    }, 2600);
  }

  function addItem(event) {
    event.preventDefault();

    const trimmedName = newItemName.trim();

    if (!trimmedName) return;

    const newItem = {
      id: crypto.randomUUID(),
      name: trimmedName,
      color: newItemColor,
    };

    setItems((currentItems) => [...currentItems, newItem]);
    setNewItemName("");
    setNewItemColor("#c46f4f");
  }

  function updateItemName(id, name) {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, name } : item))
    );
  }

  function updateItemColor(id, color) {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, color } : item))
    );
  }

  function removeItem(id) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));

    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  }

  function resetItems() {
    setItems(defaultRouletteItems);
    setSelectedItem(null);
    setRotation(0);
  }

  function clearItems() {
    setItems([]);
    setSelectedItem(null);
    setRotation(0);
  }

  return (
    <div className="page">
      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">Customizable wheel</p>
            <h2>Hobby roulette</h2>
          </div>

          <button
            className="primary-button"
            onClick={spinRoulette}
            disabled={!canSpin}
          >
            {isSpinning ? "Spinning..." : "Spin wheel"}
          </button>
        </div>

        <p className="section-description">
          Add your hobbies, choose a color for each activity, then spin the wheel
          when you need help deciding what to work on.
        </p>

        <div className="roulette-layout">
          <RouletteWheel
            items={items}
            rotation={rotation}
            selectedItem={selectedItem}
            isSpinning={isSpinning}
            onSpin={spinRoulette}
            canSpin={canSpin}
          />

          <aside className="roulette-result-card">
            <p className="section-kicker">Result</p>

            {items.length < 2 ? (
              <>
                <h3>Add at least two activities</h3>
                <p>
                  The wheel needs at least two activities before it can choose
                  one fairly.
                </p>
              </>
            ) : selectedItem ? (
              <>
                <div
                  className="selected-color-dot"
                  style={{ backgroundColor: selectedItem.color }}
                />

                <h3>{selectedItem.name}</h3>
                <p>
                  This is your chosen activity. You can start a project from this
                  later, or look for a visual prompt first.
                </p>

                <div className="button-row">
                  <button className="primary-button">Start project</button>
                  <Link className="secondary-button" to="/inspiration">
                    Get inspiration
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h3>No result yet</h3>
                <p>
                  Spin the wheel to pick one of your saved hobbies or craft
                  activities.
                </p>
              </>
            )}

            {selectedItemIndex >= 0 && (
              <p className="tiny-note">
                Selected from position {selectedItemIndex + 1} of {items.length}.
              </p>
            )}
          </aside>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">Edit wheel</p>
            <h2>Activities</h2>
          </div>

          <div className="button-row no-margin">
            <button className="secondary-button" onClick={resetItems}>
              Reset defaults
            </button>
            <button className="secondary-button danger-button" onClick={clearItems}>
              Clear all
            </button>
          </div>
        </div>

        <form className="add-form" onSubmit={addItem}>
          <input
            type="text"
            placeholder="Add hobby, e.g. candle making"
            value={newItemName}
            onChange={(event) => setNewItemName(event.target.value)}
          />

          <input
            type="color"
            value={newItemColor}
            onChange={(event) => setNewItemColor(event.target.value)}
            aria-label="Choose hobby color"
          />

          <button className="primary-button" type="submit">
            Add activity
          </button>
        </form>

        {items.length === 0 ? (
          <p className="empty-message">
            Your wheel is empty. Add a few hobbies above or reset to the default
            list.
          </p>
        ) : (
          <div className="activity-editor-list">
            {items.map((item, index) => (
              <article className="activity-editor-row" key={item.id}>
                <span className="activity-number">{index + 1}</span>

                <input
                  type="text"
                  value={item.name}
                  onChange={(event) =>
                    updateItemName(item.id, event.target.value)
                  }
                  aria-label="Activity name"
                />

                <label className="color-input-label">
                  <span style={{ backgroundColor: item.color }} />
                  <input
                    type="color"
                    value={item.color}
                    onChange={(event) =>
                      updateItemColor(item.id, event.target.value)
                    }
                    aria-label={`Choose color for ${item.name}`}
                  />
                </label>

                <button
                  className="remove-activity-button"
                  onClick={() => removeItem(item.id)}
                  type="button"
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default RoulettePage;