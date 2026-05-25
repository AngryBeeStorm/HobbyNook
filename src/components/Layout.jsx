import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PaletteSwitcher from "./PaletteSwitcher";

function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Could not log out. Please try again.");
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">✦</div>
          <div>
            <h1>Hobby Nook</h1>
            <p>Hobby assistant</p>
          </div>
        </div>

        {user && (
          <div className="user-panel">
            <p className="section-kicker">Signed in as</p>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
        )}

        <nav className="nav-links">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/roulette">Roulette</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/inspiration">Inspiration</NavLink>
        </nav>

        <PaletteSwitcher />

        <button className="logout-button" onClick={handleLogout}>
          Log out
        </button>
      </aside>

      <main className="page-area">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;