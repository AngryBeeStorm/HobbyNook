import ProjectCard from "../components/ProjectCard";
import { sampleProjects } from "../data/sampleData";

function ProjectsPage() {
  return (
    <div className="page">
      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">Project mode</p>
            <h2>Your project panels</h2>
          </div>

          <button className="primary-button">New project</button>
        </div>

        <p className="section-description">
          Each project will eventually contain progress photos, notes, hour
          logs, inspiration cards, and a timeline of updates.
        </p>

        <div className="project-grid">
          {sampleProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProjectsPage;