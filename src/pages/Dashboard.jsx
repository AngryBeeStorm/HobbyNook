import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import StatCard from "../components/StatCard";
import { getInspirations, getProjects } from "../services/api";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [savedInspirationsCount, setSavedInspirationsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [projectsData, inspirationsData] = await Promise.all([
          getProjects(),
          getInspirations(),
        ]);

        setProjects(projectsData.projects || []);
        setSavedInspirationsCount((inspirationsData.cards || []).length);
      } catch (error) {
        console.error(error);
        setError("Could not load your dashboard data.");
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalHours = projects.reduce(
    (total, project) => total + Number(project.hoursSpent || 0),
    0
  );

  const activeProjects = projects.filter(
    (project) => project.status === "In progress"
  ).length;

  if (isLoading) {
    return (
      <div className="page">
        <section className="section-block">
          <p className="section-kicker">Loading</p>
          <h2>Loading your creative nook...</h2>
        </section>
      </div>
    );
  }

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

      {error && (
        <section className="section-block">
          <p className="form-error">{error}</p>
        </section>
      )}

      <section className="stats-grid">
        <StatCard
          label="Active projects"
          value={activeProjects}
          detail="currently being made"
        />
        <StatCard
          label="Hours crafted"
          value={totalHours}
          detail="logged across projects"
        />
        <StatCard
          label="Saved inspirations"
          value={savedInspirationsCount}
          detail="in your treasure trove"
        />
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <p className="section-kicker">Recent projects</p>
            <h2>Project panels</h2>
          </div>

          <Link to="/projects">See all</Link>
        </div>

        {projects.length === 0 ? (
          <p className="empty-message">
            You do not have any projects yet. Start one from the project page,
            the roulette, or an inspiration card.
          </p>
        ) : (
          <div className="project-grid">
            {projects.slice(0, 2).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;