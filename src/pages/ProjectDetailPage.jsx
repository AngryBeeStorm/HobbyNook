import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import { sampleProjects } from "../data/sampleData";

const PROJECTS_KEY = "craftspark-projects";

function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  // Description Editing State
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editDescriptionText, setEditDescriptionText] = useState("");

  // Cover Image Editing State
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [openUpdateMenu, setOpenUpdateMenu] = useState(null);

  useEffect(() => {
    const savedProjects = localStorage.getItem(PROJECTS_KEY);
    const allProjects = savedProjects ? JSON.parse(savedProjects) : sampleProjects;
    const foundProject = allProjects.find((item) => item.id === projectId);
    
    if (foundProject) {
      setProject(foundProject);
      setEditDescriptionText(foundProject.description);
    }
  }, [projectId]);

  const navigate = useNavigate();

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
    
    setProject({ ...project, description: editDescriptionText });
    setIsEditingDescription(false);
  }

  function handleDeleteProject() {
    const confirmed = window.confirm(
      "Delete this project? This cannot be undone."
    );
    if (!confirmed) return;

    const savedProjects = localStorage.getItem(PROJECTS_KEY);
    const allProjects = savedProjects ? JSON.parse(savedProjects) : sampleProjects;
    const updatedProjects = allProjects.filter((p) => p.id !== projectId);

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    navigate("/projects");
  }

  function handleDeleteProjectInspiration(cardId) {
    const confirmed = window.confirm(
      "Remove this inspiration from the project? It will remain in your trove."
    );
    if (!confirmed) return;

    const savedProjects = localStorage.getItem(PROJECTS_KEY);
    const allProjects = savedProjects ? JSON.parse(savedProjects) : sampleProjects;
    const updatedProjects = allProjects.map((p) => {
      if (p.id === projectId) {
        return {
          ...p,
          inspirations: (p.inspirations || []).filter((card) => card.id !== cardId),
        };
      }
      return p;
    });

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    setProject((currentProject) => ({
      ...currentProject,
      inspirations: (currentProject.inspirations || []).filter(
        (card) => card.id !== cardId
      ),
    }));
  }

  function handleUpdateStatus(value) {
    const savedProjects = localStorage.getItem(PROJECTS_KEY);
    const allProjects = savedProjects ? JSON.parse(savedProjects) : sampleProjects;

    const updatedProjects = allProjects.map((p) => {
      if (p.id === projectId) {
        return { ...p, status: value };
      }
      return p;
    });

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    setProject({ ...project, status: value });
  }


  function handleEditUpdate(update) {
    setOpenUpdateMenu(null);
    navigate(`/projects/${projectId}/log`, { state: { update, projectTitle: project.title } });
  }

  function handleDeleteUpdate(updateId) {
    const confirmed = window.confirm(
      "Delete this progress update? Hours logged will be removed from the total."
    );
    if (!confirmed) return;

    const savedProjects = localStorage.getItem(PROJECTS_KEY);
    const allProjects = savedProjects ? JSON.parse(savedProjects) : sampleProjects;

    const updatedProjects = allProjects.map((p) => {
      if (p.id === projectId) {
        const updateToRemove = (p.updates || []).find((update) => update.id === updateId);
        const removedHours = updateToRemove ? parseFloat(updateToRemove.hours) || 0 : 0;

        return {
          ...p,
          hoursSpent: Math.max(0, (p.hoursSpent || 0) - removedHours),
          updates: (p.updates || []).filter((update) => update.id !== updateId),
        };
      }
      return p;
    });

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
    setProject((currentProject) => {
      const updateToRemove = (currentProject.updates || []).find((update) => update.id === updateId);
      const removedHours = updateToRemove ? parseFloat(updateToRemove.hours) || 0 : 0;

      return {
        ...currentProject,
        hoursSpent: Math.max(0, (currentProject.hoursSpent || 0) - removedHours),
        updates: (currentProject.updates || []).filter((update) => update.id !== updateId),
      };
    });
    setOpenUpdateMenu(null);
  }

  // --- DRAG AND DROP HANDLERS ---
  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processImageFile(file);
  }

  function handleFileSelect(e) {
    const file = e.target.files[0];
    processImageFile(file);
  }

  function processImageFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, etc).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large! Please use an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target.result;
      
      const savedProjects = localStorage.getItem(PROJECTS_KEY);
      const allProjects = savedProjects ? JSON.parse(savedProjects) : sampleProjects;

      const updatedProjects = allProjects.map((p) => {
        if (p.id === projectId) return { ...p, coverImage: base64Image };
        return p;
      });

      localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
      
      setProject({ ...project, coverImage: base64Image });
      setIsEditingCover(false);
    };

    reader.readAsDataURL(file);
  }
  // ------------------------------

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
                    setEditDescriptionText(project.description); 
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

          {/* ----- DRAG AND DROP ZONE ----- */}
          {isEditingCover ? (
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${isDragging ? "var(--primary)" : "var(--border)"}`,
                borderRadius: "14px",
                padding: "2rem",
                textAlign: "center",
                background: isDragging ? "var(--surfaceAlt)" : "transparent",
                marginBottom: "1.5rem",
                transition: "all 0.2s ease"
              }}
            >
              <p style={{ fontWeight: 800, color: "var(--mutedText)", marginBottom: "1rem" }}>
                {isDragging ? "Drop image here!" : "Drag & drop a new cover image here"}
              </p>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                id="cover-upload"
                style={{ display: "none" }}
              />
              
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                <label htmlFor="cover-upload" className="primary-button" style={{ display: "inline-block", padding: "0.5rem 1rem", fontSize: "0.9rem", cursor: "pointer", margin: 0 }}>
                  Browse files
                </label>
                <button 
                  className="secondary-button" 
                  onClick={() => setIsEditingCover(false)}
                  style={{ padding: "0.5rem 1rem", fontSize: "0.9rem", margin: 0 }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="button-row">
              <Link className="primary-button" to={`/projects/${project.id}/log`}>
                Add progress update
              </Link>
              
              {!isEditingDescription && (
                <>
                  <button className="secondary-button" onClick={() => setIsEditingCover(true)}>
                    Change cover
                  </button>
                  <button className="secondary-button" onClick={() => setIsEditingDescription(true)}>
                    Edit description
                  </button>
                  <button className="secondary-button" onClick={handleDeleteProject}>
                    Delete project
                  </button>
                </>
              )}
            </div>
          )}
          {/* ------------------------------ */}
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <p>Status</p>
          <select
            className="stat-card-select"
            value={project.status}
            onChange={(event) => handleUpdateStatus(event.target.value)}
          >
            <option value="Not started">Not started</option>
            <option value="In progress">In progress</option>
            <option value="Paused">Paused</option>
            <option value="Finished">Finished</option>
          </select>
        </article>
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
                <div className="timeline-item-header">
                  <span>{update.date}</span>
                  <div className="timeline-item-menu">
                    <button
                      className="timeline-menu-button"
                      onClick={() => setOpenUpdateMenu((current) => current === update.id ? null : update.id)}
                      aria-label="Update options"
                      type="button"
                    >
                      •••
                    </button>
                    {openUpdateMenu === update.id && (
                      <div className="timeline-item-dropdown">
                        <button type="button" onClick={() => handleEditUpdate(update)}>
                          Edit update
                        </button>
                        <button type="button" onClick={() => handleDeleteUpdate(update.id)}>
                          Delete update
                        </button>
                      </div>
                    )}
                  </div>
                </div>
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

        {project.inspirations && project.inspirations.length > 0 ? (
          <div className="saved-inspiration-grid">
            {project.inspirations.map((card) => (
              <article className="saved-card" key={card.id}>
                <img src={card.image} alt="Inspiration" />
                <div>
                  <strong>{card.mood}</strong>
                  <div className="mini-word-list">
                    {card.words.map((word) => (
                      <span key={word}>{word}</span>
                    ))}
                  </div>
                  <div className="mini-palette">
                    {card.palette.map((color) => (
                      <span key={color} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <div className="button-row" style={{ marginTop: "1rem" }}>
                    <button
                      className="secondary-button"
                      onClick={() => handleDeleteProjectInspiration(card.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="inspiration-slots">
            <div>Empty slot 1</div>
            <div>Empty slot 2</div>
            <div>Empty slot 3</div>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProjectDetailPage;