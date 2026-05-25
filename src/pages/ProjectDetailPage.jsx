import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatCard from "../components/StatCard";
import {
  deleteProject,
  deleteProjectUpdate,
  getProject,
  unlinkInspirationFromProject,
  updateProject,
  uploadProjectCover,
} from "../services/api";

function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editDescriptionText, setEditDescriptionText] = useState("");

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editNotesText, setEditNotesText] = useState("");

  const [isEditingCover, setIsEditingCover] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [isSavingDescription, setIsSavingDescription] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  const [openUpdateMenu, setOpenUpdateMenu] = useState(null);

  async function loadProject() {
    setIsLoading(true);
    setPageError("");

    try {
      const data = await getProject(projectId);

      setProject(data.project);
      setEditDescriptionText(data.project.description || "");
      setEditNotesText(data.project.personalNotes || "");
    } catch (error) {
      console.error(error);
      setPageError(error.message || "Project could not be found.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function handleSaveDescription() {
    if (!project) return;

    setIsSavingDescription(true);

    try {
      await updateProject(project.id, {
        description: editDescriptionText,
      });

      setProject((currentProject) => ({
        ...currentProject,
        description: editDescriptionText,
      }));

      setIsEditingDescription(false);
    } catch (error) {
      console.error(error);
      alert(error.message || "Could not save description.");
    } finally {
      setIsSavingDescription(false);
    }
  }

  async function handleSaveNotes() {
    if (!project) return;

    setIsSavingNotes(true);

    try {
      await updateProject(project.id, {
        personalNotes: editNotesText,
      });

      setProject((currentProject) => ({
        ...currentProject,
        personalNotes: editNotesText,
      }));

      setIsEditingNotes(false);
    } catch (error) {
      console.error(error);
      alert(error.message || "Could not save notes.");
    } finally {
      setIsSavingNotes(false);
    }
  }

  async function handleUpdateStatus(value) {
    if (!project) return;

    setIsSavingStatus(true);

    try {
      await updateProject(project.id, {
        status: value,
      });

      setProject((currentProject) => ({
        ...currentProject,
        status: value,
      }));
    } catch (error) {
      console.error(error);
      alert(error.message || "Could not update status.");
    } finally {
      setIsSavingStatus(false);
    }
  }

  async function handleDeleteProject() {
    if (!project) return;

    const confirmed = window.confirm(
      "Delete this project? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      await deleteProject(project.id);
      navigate("/projects");
    } catch (error) {
      console.error(error);
      alert(error.message || "Could not delete project.");
    }
  }

  function validateImageFile(file) {
    if (!file) return false;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return false;
    }

    return true;
  }

  async function handleCoverFile(file) {
    if (!project || !validateImageFile(file)) return;

    setIsUploadingCover(true);

    try {
      const data = await uploadProjectCover({
        projectId: project.id,
        imageFile: file,
      });

      setProject((currentProject) => ({
        ...currentProject,
        coverImage: data.coverImage,
      }));

      setIsEditingCover(false);
    } catch (error) {
      console.error(error);
      alert(error.message || "Could not upload cover image.");
    } finally {
      setIsUploadingCover(false);
    }
  }

  function handleCoverDrop(event) {
    event.preventDefault();
    setIsDraggingCover(false);
    handleCoverFile(event.dataTransfer.files[0]);
  }

  function handleCoverSelect(event) {
    handleCoverFile(event.target.files[0]);
  }

  function handleEditUpdate(update) {
    setOpenUpdateMenu(null);
    navigate(`/projects/${project.id}/log`, {
      state: {
        update,
        projectTitle: project.title,
      },
    });
  }

  async function handleDeleteUpdate(updateId) {
    if (!project) return;

    const confirmed = window.confirm(
      "Delete this progress update? Its logged hours will be removed from the project total."
    );

    if (!confirmed) return;

    try {
      await deleteProjectUpdate({
        projectId: project.id,
        updateId,
      });

      await loadProject();
      setOpenUpdateMenu(null);
    } catch (error) {
      console.error(error);
      alert(error.message || "Could not delete progress update.");
    }
  }

  async function handleUnlinkInspiration(inspirationId) {
    if (!project) return;

    const confirmed = window.confirm(
      "Remove this inspiration from the project? It will stay in your treasure trove."
    );

    if (!confirmed) return;

    try {
      await unlinkInspirationFromProject({
        projectId: project.id,
        inspirationId,
      });

      setProject((currentProject) => ({
        ...currentProject,
        inspirations: (currentProject.inspirations || []).filter(
          (card) => card.id !== inspirationId
        ),
      }));
    } catch (error) {
      console.error(error);
      alert(error.message || "Could not unlink inspiration.");
    }
  }

  if (isLoading) {
    return (
      <div className="page">
        <section className="section-block">
          <p className="section-kicker">Loading</p>
          <h2>Loading project...</h2>
        </section>
      </div>
    );
  }

  if (pageError || !project) {
    return (
      <div className="page">
        <section className="section-block">
          <h2>Project not found</h2>
          <p className="empty-message">
            {pageError || "This project could not be loaded."}
          </p>

          <div className="button-row">
            <Link className="secondary-button" to="/projects">
              Back to projects
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const sortedUpdates = [...(project.updates || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="page">
      <Link className="back-link" to="/projects">
        ← Back to projects
      </Link>

      <section className="project-detail-hero">
        <img
          src={
            project.coverImage ||
            "https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&q=80&w=600"
          }
          alt=""
        />

        <div>
          <p className="section-kicker">{project.category}</p>
          <h2>{project.title}</h2>

          {isEditingDescription ? (
            <div
              style={{
                display: "grid",
                gap: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <textarea
                rows="4"
                value={editDescriptionText}
                onChange={(event) =>
                  setEditDescriptionText(event.target.value)
                }
                placeholder="Describe this project..."
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "0.8rem",
                  background: "var(--surface)",
                  color: "var(--text)",
                  fontFamily: "inherit",
                }}
              />

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  className="primary-button"
                  onClick={handleSaveDescription}
                  disabled={isSavingDescription}
                >
                  {isSavingDescription ? "Saving..." : "Save"}
                </button>

                <button
                  className="secondary-button"
                  onClick={() => {
                    setIsEditingDescription(false);
                    setEditDescriptionText(project.description || "");
                  }}
                  disabled={isSavingDescription}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p>
              {project.description || (
                <span style={{ color: "var(--mutedText)" }}>
                  No description yet.
                </span>
              )}
            </p>
          )}

          {isEditingCover ? (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDraggingCover(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDraggingCover(false);
              }}
              onDrop={handleCoverDrop}
              style={{
                border: `2px dashed ${
                  isDraggingCover ? "var(--primary)" : "var(--border)"
                }`,
                borderRadius: "14px",
                padding: "1.5rem",
                textAlign: "center",
                marginBottom: "1.5rem",
                background: isDraggingCover
                  ? "var(--surfaceAlt)"
                  : "transparent",
              }}
            >
              <p style={{ color: "var(--mutedText)", fontWeight: 800 }}>
                Drag & drop a new cover image here
              </p>

              <input
                type="file"
                accept="image/*"
                id="cover-upload"
                onChange={handleCoverSelect}
                style={{ display: "none" }}
              />

              <div className="button-row" style={{ justifyContent: "center" }}>
                <label
                  htmlFor="cover-upload"
                  className="primary-button"
                  style={{ cursor: "pointer" }}
                >
                  {isUploadingCover ? "Uploading..." : "Browse files"}
                </label>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setIsEditingCover(false)}
                  disabled={isUploadingCover}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="button-row">
              <Link
                className="primary-button"
                to={`/projects/${project.id}/log`}
              >
                Add progress update
              </Link>

              <button
                className="secondary-button"
                onClick={() => setIsEditingCover(true)}
              >
                Change cover
              </button>

              <button
                className="secondary-button"
                onClick={() => setIsEditingDescription(true)}
              >
                Edit description
              </button>

              <button className="secondary-button" onClick={handleDeleteProject}>
                Delete project
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <p>Status</p>

          <select
            className="stat-card-select"
            value={project.status || "Not started"}
            onChange={(event) => handleUpdateStatus(event.target.value)}
            disabled={isSavingStatus}
          >
            <option value="Not started">Not started</option>
            <option value="In progress">In progress</option>
            <option value="Paused">Paused</option>
            <option value="Finished">Finished</option>
          </select>

          {isSavingStatus && <span>Saving status...</span>}
        </article>

        <StatCard label="Hours spent" value={Number(project.hoursSpent || 0)} />

        <StatCard label="Updates" value={(project.updates || []).length} />
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">Private</p>
            <h2>Personal Notes</h2>
          </div>

          {!isEditingNotes && (
            <button
              className="secondary-button"
              onClick={() => setIsEditingNotes(true)}
              style={{ margin: 0 }}
            >
              Edit notes
            </button>
          )}
        </div>

        {isEditingNotes ? (
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <textarea
              rows="6"
              placeholder="Jot down future ideas, yarn batch numbers, reminders, or private notes..."
              value={editNotesText}
              onChange={(event) => setEditNotesText(event.target.value)}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "1rem",
                background: "var(--surface)",
                color: "var(--text)",
                fontFamily: "inherit",
                resize: "vertical",
              }}
            />

            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginTop: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <button
                className="primary-button"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
              >
                {isSavingNotes ? "Saving..." : "Save"}
              </button>

              <button
                className="secondary-button"
                onClick={() => {
                  setIsEditingNotes(false);
                  setEditNotesText(project.personalNotes || "");
                }}
                disabled={isSavingNotes}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "var(--surfaceAlt)",
              padding: "1.5rem",
              borderRadius: "16px",
              minHeight: "100px",
              whiteSpace: "pre-wrap",
              lineHeight: "1.7",
            }}
          >
            {project.personalNotes ? (
              project.personalNotes
            ) : (
              <span style={{ color: "var(--mutedText)" }}>
                No personal notes yet. Jot down some ideas!
              </span>
            )}
          </div>
        )}
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
            No updates yet. Add a progress update to start building this
            project’s timeline.
          </p>
        ) : (
          <div className="timeline">
            {sortedUpdates.map((update, index) => {
              const hasImage = Boolean(update.image);
              const isEven = index % 2 === 0;

              return (
                <article
                  className={`timeline-item ${
                    hasImage ? "has-image" : "no-image"
                  } ${isEven ? "even-layout" : "odd-layout"}`}
                  key={update.id}
                >
                  <div className="timeline-text-content">
                    <div className="timeline-item-header">
                      <span>{update.date}</span>

                      <div className="timeline-item-menu">
                        <button
                          className="timeline-menu-button"
                          onClick={() =>
                            setOpenUpdateMenu(
                              openUpdateMenu === update.id ? null : update.id
                            )
                          }
                        >
                          •••
                        </button>

                        {openUpdateMenu === update.id && (
                          <div className="timeline-item-dropdown">
                            <button onClick={() => handleEditUpdate(update)}>
                              Edit update
                            </button>

                            <button
                              onClick={() => handleDeleteUpdate(update.id)}
                            >
                              Delete update
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <h3>{update.title}</h3>

                    <p>
                      {update.text || (
                        <span style={{ color: "var(--mutedText)" }}>
                          No notes added.
                        </span>
                      )}
                    </p>

                    <small>{Number(update.hours || 0)} hours</small>
                  </div>

                  {hasImage && (
                    <div className="timeline-image-content">
                      <img src={update.image} alt="Progress update" />
                    </div>
                  )}
                </article>
              );
            })}
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
                <img src={card.image} alt={card.imageAlt || "Inspiration"} />

                <div>
                  <strong>{card.mood}</strong>

                  <div className="mini-word-list">
                    {(card.words || []).map((word) => (
                      <span key={word}>{word}</span>
                    ))}
                  </div>

                  <div className="mini-palette">
                    {(card.palette || []).map((color) => (
                      <span key={color} style={{ backgroundColor: color }} />
                    ))}
                  </div>

                  {card.imageCredit && (
                    <p className="image-credit">
                      Image:{" "}
                      {card.imageSourceUrl ? (
                        <a
                          href={card.imageSourceUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {card.imageCredit}
                        </a>
                      ) : (
                        card.imageCredit
                      )}
                    </p>
                  )}

                  <div className="button-row">
                    <button
                      className="secondary-button"
                      onClick={() => handleUnlinkInspiration(card.id)}
                    >
                      Remove from project
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