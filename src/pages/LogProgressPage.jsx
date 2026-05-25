import { useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { addProjectUpdate, editProjectUpdate } from "../services/api";

function LogProgressPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const editingUpdate = location.state?.update || null;
  const projectTitle = location.state?.projectTitle || "";
  const isEditing = Boolean(editingUpdate?.id);

  const [title, setTitle] = useState(editingUpdate?.title || "");
  const [date, setDate] = useState(
    editingUpdate?.date || new Date().toISOString().split("T")[0]
  );
  const [hours, setHours] = useState(editingUpdate?.hours?.toString() || "");
  const [notes, setNotes] = useState(editingUpdate?.text || "");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editingUpdate?.image || null);
  const [keepExistingImage, setKeepExistingImage] = useState(
    Boolean(editingUpdate?.image)
  );

  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function handleDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    processImage(event.dataTransfer.files[0]);
  }

  function handleFileSelect(event) {
    processImage(event.target.files[0]);
    event.target.value = "";
  }

  function processImage(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setKeepExistingImage(false);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    setKeepExistingImage(false);
  }

  function restoreExistingImage() {
    if (!editingUpdate?.image) return;

    setImageFile(null);
    setImagePreview(editingUpdate.image);
    setKeepExistingImage(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSaving(true);

    try {
      if (isEditing) {
        await editProjectUpdate({
          updateId: editingUpdate.id,
          projectId,
          title,
          date,
          hours: parseFloat(hours) || 0,
          notes,
          imageFile,
          keepExistingImage,
        });
      } else {
        await addProjectUpdate({
          projectId,
          title,
          date,
          hours: parseFloat(hours) || 0,
          notes,
          imageFile,
        });
      }

      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error("Save update error:", error);
      setError(error.message || "Could not save progress update.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="page">
      <Link className="back-link" to={`/projects/${projectId}`}>
        ← Back to project details
      </Link>

      <div className="two-column">
        <section className="section-block">
          <div className="section-header">
            <div>
              <p className="section-kicker">Update Timeline</p>
              <h2>{isEditing ? "Edit update" : "Log progress"}</h2>
              {projectTitle && (
                <p className="section-description">{projectTitle}</p>
              )}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: "1.25rem" }}
          >
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label
                style={{
                  fontWeight: 800,
                  color: "var(--mutedText)",
                  fontSize: "0.9rem",
                }}
              >
                Update Title
              </label>

              <input
                type="text"
                required
                placeholder="e.g., Finished the back panel"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "0.8rem",
                  background: "var(--surface)",
                  color: "var(--text)",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div style={{ display: "grid", gap: "0.5rem" }}>
                <label
                  style={{
                    fontWeight: 800,
                    color: "var(--mutedText)",
                    fontSize: "0.9rem",
                  }}
                >
                  Date
                </label>

                <input
                  type="date"
                  required
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
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
                <label
                  style={{
                    fontWeight: 800,
                    color: "var(--mutedText)",
                    fontSize: "0.9rem",
                  }}
                >
                  Hours Spent
                </label>

                <input
                  type="number"
                  step="0.5"
                  min="0"
                  required
                  placeholder="e.g., 2.5"
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "14px",
                    padding: "0.8rem",
                    background: "var(--surface)",
                    color: "var(--text)",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label
                style={{
                  fontWeight: 800,
                  color: "var(--mutedText)",
                  fontSize: "0.9rem",
                }}
              >
                Notes & Details
              </label>

              <textarea
                rows="4"
                placeholder="Did you learn any new techniques? Run into issues?"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
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
              <button
                type="submit"
                className="primary-button"
                disabled={isSaving}
              >
                {isSaving
                  ? "Saving..."
                  : isEditing
                  ? "Save changes"
                  : "Save update"}
              </button>

              <Link className="secondary-button" to={`/projects/${projectId}`}>
                Cancel
              </Link>
            </div>
          </form>
        </section>

        <section className="section-block">
          <div className="section-header">
            <div>
              <p className="section-kicker">Visuals</p>
              <h2>{isEditing ? "Edit Image" : "Add Image"}</h2>
            </div>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              minHeight: "220px",
              border: `2px dashed ${
                isDragging ? "var(--primary)" : "var(--border)"
              }`,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "14px",
              overflow: "hidden",
              padding: "1.5rem",
              textAlign: "center",
              background: isDragging ? "var(--surfaceAlt)" : "transparent",
              transition: "all 0.2s ease",
            }}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Update preview"
                  style={{
                    maxHeight: "250px",
                    borderRadius: "12px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />

                <div className="button-row" style={{ justifyContent: "center" }}>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={removeImage}
                    style={{
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    Remove image
                  </button>

                  {isEditing && editingUpdate?.image && !keepExistingImage && (
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={restoreExistingImage}
                      style={{
                        padding: "0.4rem 0.8rem",
                        fontSize: "0.85rem",
                      }}
                    >
                      Restore old image
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <p
                  style={{
                    fontWeight: 800,
                    color: "var(--mutedText)",
                    margin: 0,
                  }}
                >
                  Drag & drop image here
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  id="update-upload"
                  style={{ display: "none" }}
                />

                <label
                  htmlFor="update-upload"
                  className="primary-button"
                  style={{
                    cursor: "pointer",
                    margin: 0,
                    padding: "0.5rem 1rem",
                  }}
                >
                  Browse files
                </label>
              </>
            )}
          </div>

          {isEditing && (
            <p className="section-description" style={{ marginTop: "1rem" }}>
              Keeping the current image will preserve it. Choosing a new image
              will replace it. Removing the image will save the update without
              one.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default LogProgressPage;