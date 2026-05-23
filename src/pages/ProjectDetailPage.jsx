import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import StatCard from "../components/StatCard";
import { sampleProjects } from "../data/sampleData";

const PROJECTS_KEY = "craftspark-projects";

function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  // New state variables for handling inline description editing
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editDescriptionText, setEditDescriptionText] = useState("");

  useEffect(() => {
    const savedProjects = localStorage.getItem(PROJECTS_KEY);
    const allProjects = savedProjects ? JSON.parse(savedProjects) : sampleProjects;
    const foundProject = allProjects.find((item) => item.id === projectId);
    
    if (foundProject) {
      setProject(foundProject);
      // Pre-fill our edit box with the current description
      setEditDescriptionText(foundProject.description);
    }
  }, [projectId]);

  // Function to save the newly edited description to local storage
  function handleSaveDescription() {
    const savedProjects = localStorage.getItem(PROJECTS_KEY);
    const allProjects = savedProjects ? JSON.parse(savedProjects) : sampleProjects;

    const updatedProjects = allProjects.map((p) => {
      if (p.id === projectId) {
        return { ...p, description: editDescriptionText };
      }
      return p;
    });

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    
    // Update the live UI so the new text shows instantly
    setProject({ ...project, description: editDescriptionText });
    setIsEditingDescription(false);
  }

  if (!project) {
    return (
      <div className="page">
        <section className="section-block">
          <h2>Project not found</h2>
          <Link to="/projects">Back to projects</Link>
        </section>
      </div>
    );
  }

  const sortedUpdates = [...project.updates].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="page">
      <Link className="back-link" to="/projects">
        ← Back to projects
      </Link>

      <section className="project-detail-hero">
        <img src={project.coverImage} alt="" />

        <div>
          <p className="section-kicker">{project.category}</p>
          <h2>{project.title}</h2>

          {/* ----- INLINE EDITING LOGIC ----- */}
          {isEditingDescription ? (
            <div style={{ display: "grid", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <textarea
                rows="4"
                value={editDescriptionText}
                onChange={(e) => setEditDescriptionText(e.target.value)}
                style={{ 
                  border: "1px solid var(--border)", 
                  borderRadius: "14px", 
                  padding: "0.8rem", 
                  background: "var(--surface)", 
                  color: "var(--text)", 
                  fontFamily: "inherit" 
                }}
              />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button 
                  className="primary-button" 
                  onClick={handleSaveDescription} 
                  style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
                >
                  Save
                </button>
                <button 
                  className="secondary-button" 
                  onClick={() => {
                    setIsEditingDescription(false);
                    setEditDescriptionText(project.description); // Reset if they cancel
                  }} 
                  style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p>{project.description}</p>
          )}
          {/* -------------------------------- */}

          <div className="button-row">
            <Link className="primary-button" to={`/projects/${project.id}/log`}>
              Add progress update
            </Link>
            <button className="secondary-button">Change cover</button>
            
            {/* Only show the Edit Description button if we aren't currently editing! */}
            {!isEditingDescription && (
              <button 
                className="secondary-button" 
                onClick={() => setIsEditingDescription(true)}
              >
                Edit description
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Status" value={project.status} />
        <StatCard label="Hours spent" value={project.hoursSpent} />
        <StatCard label="Updates" value={project.updates.length} />
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">Timeline</p>
            <h2>Progress updates</h2>
          </div>
        </div>

        {sortedUpdates.length === 0 ? (
          <p className="empty-message">
            No updates yet.
          </p>
        ) : (
          <div className="timeline">
            {sortedUpdates.map((update) => (
              <article className="timeline-item" key={update.id}>
                <span>{update.date}</span>
                <h3>{update.title}</h3>
                <p>{update.text}</p>
                <small>{update.hours} hours</small>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">Linked inspiration</p>
            <h2>Inspiration slots</h2>
          </div>

          <Link className="secondary-button" to="/inspiration">
            Find inspiration
          </Link>
        </div>

        <div className="inspiration-slots">
          <div>Empty slot 1</div>
          <div>Empty slot 2</div>
          <div>Empty slot 3</div>
        </div>
      </section>
    </div>
  );
}

export default ProjectDetailPage;