// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import StatCard from "../components/StatCard";
import { sampleProjects } from "../data/sampleData";

const PROJECTS_KEY = "craftspark-projects";

function Dashboard() {
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

  const totalHours = projects.reduce(
    (total, project) => total + project.hoursSpent,
    0
  );

  const activeProjects = projects.filter(
    (project) => project.status === "In progress"
  ).length;

  return (
    <div className="page">
      <section className="hero-card">
        <div>
          <p className="section-kicker">Welcome back</p>
          <h2>Your creative hobby nook</h2>
          <p>
            Spin a hobby roulette, collect inspiration, and keep track of your
            handmade projects in one cozy place.
          </p>

          <div className="button-row">
            <Link className="primary-button" to="/roulette">
              Spin roulette
            </Link>
            <Link className="secondary-button" to="/projects">
              View projects
            </Link>
          </div>
        </div>

        <div className="hero-orbit"></div>
      </section>

      <section className="stats-grid">
        <StatCard label="Active projects" value={activeProjects} detail="currently being made" />
        <StatCard label="Hours crafted" value={totalHours} detail="logged across projects" />
        <StatCard label="Saved inspirations" value="0" detail="ready to collect" />
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">Recent projects</p>
            <h2>Project panels</h2>
          </div>

          <Link to="/projects">See all</Link>
        </div>

        <div className="project-grid">
          {projects.slice(0, 2).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;