import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { defaultRouletteItems } from "../data/sampleData";
import { createProject, getRouletteItems } from "../services/api";

function AddProjectPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const projectIdea = location.state?.projectIdea;
  const inspirationCard = location.state?.inspirationCard;
  const passedCategory = location.state?.defaultCategory || projectIdea?.category;

  const [categories, setCategories] = useState(defaultRouletteItems);
  const [name, setName] = useState(projectIdea?.title || "");
  const [category, setCategory] = useState(
    passedCategory || defaultRouletteItems[0]?.name || "Uncategorized"
  );
  const [description, setDescription] = useState(projectIdea?.description || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getRouletteItems();
        const items = data.items?.length ? data.items : defaultRouletteItems;
        setCategories(items);

        if (!passedCategory && items[0]?.name) {
          setCategory(items[0].name);
        }
      } catch {
        setCategories(defaultRouletteItems);
      }
    }

    loadCategories();
  }, [passedCategory]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSaving(true);

    try {
      const coverImage =
        inspirationCard?.image ||
        "https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&q=80&w=600";

      await createProject({
        title: name,
        category,
        description,
        coverImage,
      });

      navigate("/projects");
    } catch (error) {
      console.error(error);
      setError(error.message || "Something went wrong while saving the project.");
    } finally {
      setIsSaving(false);
    }
  }

  const showPreview = inspirationCard || projectIdea;

  return (
    <div className="page">
      <Link className="back-link" to="/projects">
        ← Back to projects
      </Link>

      <div className={showPreview ? "two-column" : ""}>
        <section className="section-block">
          <div className="section-header">
            <div>
              <p className="section-kicker">New Project</p>
              <h2>Start something new</h2>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: "1.25rem", maxWidth: "600px" }}
          >
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label style={{ fontWeight: 800, color: "var(--mutedText)", fontSize: "0.9rem" }}>
                Project Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Chunky Knit Sweater"
                value={name}
                onChange={(event) => setName(event.target.value)}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "0.8rem",
                  background: "var(--surface)",
                  color: "var(--text)",
                }}
              />
            </div>

            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label style={{ fontWeight: 800, color: "var(--mutedText)", fontSize: "0.9rem" }}>
                Category
              </label>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "0.8rem",
                  background: "var(--surface)",
                  color: "var(--text)",
                }}
              >
                {categories.map((cat) => {
                  const categoryName = typeof cat === "string" ? cat : cat.name;

                  return (
                    <option
                      key={typeof cat === "string" ? cat : cat.id || categoryName}
                      value={categoryName}
                    >
                      {categoryName}
                    </option>
                  );
                })}

                {projectIdea?.category &&
                  !categories.some(
                    (cat) =>
                      (typeof cat === "string" ? cat : cat.name) ===
                      projectIdea.category
                  ) && (
                    <option value={projectIdea.category}>
                      {projectIdea.category}
                    </option>
                  )}
              </select>
            </div>

            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label style={{ fontWeight: 800, color: "var(--mutedText)", fontSize: "0.9rem" }}>
                Description
              </label>
              <textarea
                rows="4"
                placeholder="What are you making?"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "0.8rem",
                  background: "var(--surface)",
                  color: "var(--text)",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="button-row">
              <button type="submit" className="primary-button" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save project"}
              </button>
              <Link className="secondary-button" to="/projects">
                Cancel
              </Link>
            </div>
          </form>
        </section>

        {projectIdea && (
          <section className="section-block" style={{ height: "fit-content" }}>
            <p className="section-kicker">AI idea</p>
            <div className="saved-card" style={{ marginTop: "1rem" }}>
              <div style={{ padding: "1rem" }}>
                <strong>{projectIdea.title}</strong>
                <p style={{ margin: "0.75rem 0 0", color: "var(--mutedText)" }}>
                  {projectIdea.description}
                </p>
                <span
                  className="pill"
                  style={{ marginTop: "1rem", display: "inline-block" }}
                >
                  {projectIdea.category}
                </span>
              </div>
            </div>
          </section>
        )}

        {inspirationCard && (
          <section className="section-block" style={{ height: "fit-content" }}>
            <p className="section-kicker">Linked Inspiration</p>
            <div className="saved-card" style={{ marginTop: "1rem" }}>
              <img src={inspirationCard.image} alt="Inspiration" />
              <div>
                <strong>{inspirationCard.mood}</strong>
                <div className="mini-word-list">
                  {inspirationCard.words.map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </div>
                <div className="mini-palette">
                  {inspirationCard.palette.map((color) => (
                    <span key={color} style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default AddProjectPage;