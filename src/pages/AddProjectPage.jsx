import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const categories = getSavedCategories();
  
  const [name, setName] = useState("");
  // Fallback to "Uncategorized" if categories array is empty for some reason
  const [category, setCategory] = useState(categories[0]?.name || "Uncategorized");
  const [description, setDescription] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    try {
      const savedProjects = localStorage.getItem(PROJECTS_KEY);
      const currentProjects = savedProjects ? JSON.parse(savedProjects) : sampleProjects;

      // Fail-safe ID generation: Use crypto if available, otherwise use a timestamp
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
        coverImage: "https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&q=80&w=600" 
      };

      const updatedProjects = [newProject, ...currentProjects];
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));

      // Redirect the user
      navigate("/projects");
      
    } catch (error) {
      // If it crashes, log it and alert the user instead of failing silently
      console.error("Failed to save the project:", error);
      alert("Something went wrong while saving. Check the developer console!");
    }
  }

  return (
    <div className="page">
      <Link className="back-link" to="/projects">
        ← Back to projects
      </Link>
      
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
            <input
              type="text"
              required
              placeholder="e.g., Chunky Knit Sweater"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ border: "1px solid var(--border)", borderRadius: "14px", padding: "0.8rem", background: "var(--surface)", color: "var(--text)" }}
            />
          </div>

          <div style={{ display: "grid", gap: "0.5rem" }}>
            <label style={{ fontWeight: 800, color: "var(--mutedText)", fontSize: "0.9rem" }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ border: "1px solid var(--border)", borderRadius: "14px", padding: "0.8rem", background: "var(--surface)", color: "var(--text)" }}
            >
              {categories.map((cat) => (
                <option key={cat.id || cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gap: "0.5rem" }}>
            <label style={{ fontWeight: 800, color: "var(--mutedText)", fontSize: "0.9rem" }}>Description</label>
            <textarea
              rows="4"
              placeholder="What are you making?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ border: "1px solid var(--border)", borderRadius: "14px", padding: "0.8rem", background: "var(--surface)", color: "var(--text)", fontFamily: "inherit" }}
            />
          </div>

          <div className="button-row">
            <button type="submit" className="primary-button">Save project</button>
            <Link className="secondary-button" to="/projects">Cancel</Link>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AddProjectPage;