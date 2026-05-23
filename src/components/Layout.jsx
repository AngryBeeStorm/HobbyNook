import { NavLink, Outlet } from "react-router-dom";
import PaletteSwitcher from "./PaletteSwitcher";

function Layout() {
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

        <nav className="nav-links">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/roulette">Roulette</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/inspiration">Inspiration</NavLink>
        </nav>

        <PaletteSwitcher />
      </aside>

      <main className="page-area">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;