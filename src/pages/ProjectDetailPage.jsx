import { Link, useParams } from "react-router-dom";
import StatCard from "../components/StatCard";
import { sampleProjects } from "../data/sampleData";

function ProjectDetailPage() {
  const { projectId } = useParams();

  const project = sampleProjects.find((item) => item.id === projectId);

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
          <p>{project.description}</p>

          <div className="button-row">
            <button className="primary-button">Add progress update</button>
            <button className="secondary-button">Change cover</button>
            <button className="secondary-button">Edit description</button>
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

        {project.updates.length === 0 ? (
          <p className="empty-message">
            No updates yet. Later, this area will let the user log progress
            photos, comments, and hours spent.
          </p>
        ) : (
          <div className="timeline">
            {project.updates.map((update) => (
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