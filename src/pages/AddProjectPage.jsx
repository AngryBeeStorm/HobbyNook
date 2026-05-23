import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { defaultRouletteItems, sampleProjects } from "../data/sampleData";

const STORAGE_KEY = "craftspark-roulette-items";
const PROJECTS_KEY = "craftspark-projects";

function getSavedCategories() {
  const savedItems = localStorage.getItem(STORAGE_KEY);
  if (!savedItems) return defaultRouletteItems;
  try {
    const parsed = JSON.parse(savedItems);
    return Array.isArray(parsed) ? parsed : defaultRouletteItems;
  } catch {
    return defaultRouletteItems;
  }
}

function AddProjectPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Catch both the inspiration card AND the category from the router state
  const inspirationCard = location.state?.inspirationCard;
  const passedCategory = location.state?.defaultCategory;
  
  const categories = getSavedCategories();
  const [name, setName] = useState("");
  
  // NEW: Use the passed category if it exists, otherwise fall back to normal
  const [category, setCategory] = useState(passedCategory || categories[0]?.name || "Uncategorized");
  const [description, setDescription] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    try {
      const savedProjects = localStorage.getItem(PROJECTS_KEY);
      const currentProjects = savedProjects ? JSON.parse(savedProjects) : sampleProjects;

      const safeId = (typeof crypto !== "undefined" && crypto.randomUUID) 
        ? crypto.randomUUID() 
        : `proj-${Date.now()}`;

      const newProject = {
        id: safeId,
        title: name,
        category: category,
        description: description,
        status: "Not started",
        hoursSpent: 0,
        updates: [],
        // If an inspiration card was passed, save it!
        inspirations: inspirationCard ? [inspirationCard] : [],
        // Use the inspiration image as a default cover if it exists
        coverImage: inspirationCard ? inspirationCard.image : "https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&q=80&w=600" 
      };

      const updatedProjects = [newProject, ...currentProjects];
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
      navigate("/projects");
      
    } catch (error) {
      console.error("Failed to save the project:", error);
      alert("Something went wrong while saving. Check the developer console!");
    }
  }

  return (
    <div className="page">
      <Link className="back-link" to="/projects">
        ← Back to projects
      </Link>
      
      {/* If there is an inspiration card, use the two-column grid layout! */}
      <div className={inspirationCard ? "two-column" : ""}>
        <section className="section-block">
          <div className="section-header">
            <div>
              <p className="section-kicker">New Project</p>
              <h2>Start something new</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.25rem", maxWidth: "600px" }}>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label style={{ fontWeight: 800, color: "var(--mutedText)", fontSize: "0.9rem" }}>Project Name</label>
              <input type="text" required placeholder="e.g., Chunky Knit Sweater" value={name} onChange={(e) => setName(e.target.value)} style={{ border: "1px solid var(--border)", borderRadius: "14px", padding: "0.8rem", background: "var(--surface)", color: "var(--text)" }} />
            </div>

            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label style={{ fontWeight: 800, color: "var(--mutedText)", fontSize: "0.9rem" }}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ border: "1px solid var(--border)", borderRadius: "14px", padding: "0.8rem", background: "var(--surface)", color: "var(--text)" }}>
                {categories.map((cat) => (
                  <option key={cat.id || cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label style={{ fontWeight: 800, color: "var(--mutedText)", fontSize: "0.9rem" }}>Description</label>
              <textarea rows="4" placeholder="What are you making?" value={description} onChange={(e) => setDescription(e.target.value)} style={{ border: "1px solid var(--border)", borderRadius: "14px", padding: "0.8rem", background: "var(--surface)", color: "var(--text)", fontFamily: "inherit" }} />
            </div>

            <div className="button-row">
              <button type="submit" className="primary-button">Save project</button>
              <Link className="secondary-button" to="/projects">Cancel</Link>
            </div>
          </form>
        </section>

        {/* Display the Inspiration Card on the right side if it exists */}
        {inspirationCard && (
          <section className="section-block" style={{ height: "fit-content" }}>
            <p className="section-kicker">Linked Inspiration</p>
            <div className="saved-card" style={{ marginTop: "1rem" }}>
              <img src={inspirationCard.image} alt="Inspiration" />
              <div>
                <strong>{inspirationCard.mood}</strong>
                <div className="mini-word-list">
                  {inspirationCard.words.map((word) => <span key={word}>{word}</span>)}
                </div>
                <div className="mini-palette">
                  {inspirationCard.palette.map((color) => <span key={color} style={{ backgroundColor: color }} />)}
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