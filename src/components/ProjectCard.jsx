import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <img src={project.coverImage} alt="" />

      <div className="project-card-content">
        <div className="project-card-topline">
          <span className="pill">{project.category}</span>
          <span className="status">{project.status}</span>
        </div>

        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <div className="project-card-footer">
          <span>{project.hoursSpent} hours logged</span>
          <Link to={`/projects/${project.id}`}>Open project</Link>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;