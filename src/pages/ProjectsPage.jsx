import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { getProjects, getRouletteItems } from "../services/api";
import { defaultRouletteItems } from "../data/sampleData";
import { fetchProjectIdeas } from "../services/openaiApi";

function mergeCategories(projects, savedRouletteItems) {
  const projectCategories = Array.isArray(projects)
    ? projects.map((project) => project.category).filter(Boolean)
    : [];

  const rouletteCategories = Array.isArray(savedRouletteItems)
    ? savedRouletteItems.map((item) => item.name).filter(Boolean)
    : [];

  const allCategories = Array.from(
    new Set([...projectCategories, ...rouletteCategories])
  );

  return allCategories.length
    ? allCategories
    : defaultRouletteItems.map((item) => item.name);
}

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [aiPromptType, setAiPromptType] = useState("title");
  const [aiInput, setAiInput] = useState("");
  const [aiCategory, setAiCategory] = useState("");
  const [aiIdeas, setAiIdeas] = useState([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [aiError, setAiError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    async function loadProjectsPage() {
      try {
        const [projectsData, rouletteData] = await Promise.all([
          getProjects(),
          getRouletteItems(),
        ]);

        const currentProjects = projectsData.projects || [];
        const currentRouletteItems = rouletteData.items || [];

        setProjects(currentProjects);
        setCategories(mergeCategories(currentProjects, currentRouletteItems));
      } catch (error) {
        console.error(error);
        setPageError("Could not load your projects.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProjectsPage();
  }, []);

  useEffect(() => {
    if (!aiCategory && categories.length) {
      setAiCategory(categories[0]);
    }
  }, [categories, aiCategory]);

  async function handleGenerateIdeas() {
    if (isGeneratingIdeas) return;

    const promptValue = aiPromptType === "category" ? aiCategory : aiInput.trim();

    if (!promptValue) {
      setAiError("Please enter a title or description, or choose a category first.");
      return;
    }

    setAiError("");
    setIsGeneratingIdeas(true);

    try {
      const ideas = await fetchProjectIdeas({
        promptType: aiPromptType,
        promptValue,
        categories,
        ideaCount: 3,
      });

      setAiIdeas(ideas);
    } catch (error) {
      console.error(error);
      setAiError(error.message || "Unable to generate ideas right now.");
    } finally {
      setIsGeneratingIdeas(false);
    }
  }

  if (isLoading) {
    return (
      <div className="page">
        <section className="section-block">
          <p className="section-kicker">Loading</p>
          <h2>Loading your projects...</h2>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">Project mode</p>
            <h2>Your project panels</h2>
          </div>

          <Link className="primary-button" to="/add-project">
            New project
          </Link>
        </div>

        <p className="section-description">
          Each project can contain progress photos, notes, hour logs,
          inspiration cards, and a timeline of updates.
        </p>

        {pageError && <p className="form-error">{pageError}</p>}

        {projects.length === 0 ? (
          <p className="empty-message">
            You do not have any projects yet. Create your first project to start
            building your craft archive.
          </p>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">AI workshop</p>
            <h2>Generate creative project ideas</h2>
          </div>
        </div>

        <p className="section-description">
          Use a title, description, or category prompt to create starter ideas
          you can turn into a project.
        </p>

        <div className="ai-idea-form">
          <div className="ai-input-type-row">
            <label>
              <input
                type="radio"
                name="idea-type"
                checked={aiPromptType === "title"}
                onChange={() => setAiPromptType("title")}
              />
              Title
            </label>

            <label>
              <input
                type="radio"
                name="idea-type"
                checked={aiPromptType === "description"}
                onChange={() => setAiPromptType("description")}
              />
              Description
            </label>

            <label>
              <input
                type="radio"
                name="idea-type"
                checked={aiPromptType === "category"}
                onChange={() => setAiPromptType("category")}
              />
              Category
            </label>
          </div>

          {aiPromptType === "category" ? (
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label style={{ fontWeight: 800, color: "var(--mutedText)", fontSize: "0.9rem" }}>
                Choose category
              </label>
              <select
                value={aiCategory}
                onChange={(event) => setAiCategory(event.target.value)}
              >
                {categories.map((categoryName) => (
                  <option key={categoryName} value={categoryName}>
                    {categoryName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <label style={{ fontWeight: 800, color: "var(--mutedText)", fontSize: "0.9rem" }}>
                {aiPromptType === "title"
                  ? "Project title"
                  : "Project description"}
              </label>

              {aiPromptType === "title" ? (
                <input
                  type="text"
                  placeholder="e.g., Cozy yarn organizer"
                  value={aiInput}
                  onChange={(event) => setAiInput(event.target.value)}
                />
              ) : (
                <textarea
                  rows="3"
                  placeholder="e.g., A small sewing kit that fits in a travel pouch."
                  value={aiInput}
                  onChange={(event) => setAiInput(event.target.value)}
                />
              )}
            </div>
          )}

          <div className="button-row" style={{ alignItems: "center" }}>
            <button
              type="button"
              className="primary-button"
              onClick={handleGenerateIdeas}
              disabled={isGeneratingIdeas}
            >
              {isGeneratingIdeas ? "Generating ideas…" : "Generate ideas"}
            </button>
          </div>

          {aiError && <p className="ai-error-message">{aiError}</p>}
        </div>

        {aiIdeas.length > 0 && (
          <div className="ai-ideas-grid">
            {aiIdeas.map((idea, index) => (
              <article key={`${idea.title}-${index}`} className="ai-idea-card">
                <div className="ai-idea-card-topline">
                  <span className="pill">{idea.category}</span>
                </div>

                <h3>{idea.title}</h3>
                <p>{idea.description}</p>

                <Link
                  className="primary-button"
                  to="/add-project"
                  state={{ projectIdea: idea }}
                >
                  Start this project
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProjectsPage;