import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { sampleProjects } from "../data/sampleData"; // <-- This was the missing link!

const PROJECTS_KEY = "craftspark-projects";

function LogProgressPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [hours, setHours] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    
    const savedProjects = localStorage.getItem(PROJECTS_KEY);
    const currentProjects = savedProjects ? JSON.parse(savedProjects) : sampleProjects;
    
    const updatedProjects = currentProjects.map(project => {
      if (project.id === projectId) {
        // Fallback for missing crypto.randomUUID
        const safeId = (typeof crypto !== "undefined" && crypto.randomUUID) 
          ? crypto.randomUUID() 
          : `update-${Date.now()}`;

        const newUpdate = {
          id: safeId,
          title: title,
          date: date,
          hours: parseFloat(hours) || 0,
          text: notes
        };
        return {
          ...project,
          status: "In progress",
          hoursSpent: project.hoursSpent + (parseFloat(hours) || 0),
          updates: [newUpdate, ...project.updates]
        };
      }
      return project;
    });

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    navigate(`/projects/${projectId}`);
  }

  return (
    <div className="page">
      <Link className="back-link" to={`/projects/${projectId}`}>
        ← Back to project details
      </Link>
      
      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">Update Timeline</p>
            <h2>Log progress</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.25rem", maxWidth: "600px" }}>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <label style={{ fontWeight: 800, color: "var(--mutedText)", fontSize: "0.9rem" }}>Update Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Finished the back panel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ border: "1px solid var(--border)", borderRadius: "14px", padding: "0.8rem", background: "var(--surface)", color: "var(--text)" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label style={{ fontWeight: 800, color: "var(--mutedText)", fontSize: "0.9rem" }}>Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ border: "1px solid var(--border)", borderRadius: "14px", padding: "0.8rem", background: "var(--surface)", color: "var(--text)" }}
              />
            </div>

            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label style={{ fontWeight: 800, color: "var(--mutedText)", fontSize: "0.9rem" }}>Hours Spent</label>
              <input
                type="number"
                step="0.5"
                min="0"
                required
                placeholder="e.g., 2.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                style={{ border: "1px solid var(--border)", borderRadius: "14px", padding: "0.8rem", background: "var(--surface)", color: "var(--text)" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gap: "0.5rem" }}>
            <label style={{ fontWeight: 800, color: "var(--mutedText)", fontSize: "0.9rem" }}>Notes & Details</label>
            <textarea
              rows="4"
              placeholder="Did you learn any new techniques? Run into issues?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ border: "1px solid var(--border)", borderRadius: "14px", padding: "0.8rem", background: "var(--surface)", color: "var(--text)", fontFamily: "inherit" }}
            />
          </div>

          <div className="button-row">
            <button type="submit" className="primary-button">Save update</button>
            <Link className="secondary-button" to={`/projects/${projectId}`}>Cancel</Link>
          </div>
        </form>
      </section>
    </div>
  );
}

export default LogProgressPage;