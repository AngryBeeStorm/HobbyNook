import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { sampleProjects } from "../data/sampleData";

const PROJECTS_KEY = "craftspark-projects";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const savedProjects = localStorage.getItem(PROJECTS_KEY);
    
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects(sampleProjects);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(sampleProjects));
    }
  }, []);

  return (
    <div className="page">
      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">Project mode</p>
            <h2>Your project panels</h2>
          </div>

          <Link className="primary-button" to="/add-project">New project</Link>
        </div>

        <p className="section-description">
          Each project will eventually contain progress photos, notes, hour
          logs, inspiration cards, and a timeline of updates.
        </p>

        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProjectsPage;