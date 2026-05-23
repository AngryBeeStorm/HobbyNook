import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import InspirationPage from "./pages/InspirationPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import RoulettePage from "./pages/RoulettePage";
import AddProjectPage from "./pages/AddProjectPage";
import LogProgressPage from "./pages/LogProgressPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roulette" element={<RoulettePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/inspiration" element={<InspirationPage />} />
          <Route path="/add-project" element={<AddProjectPage />} />
          <Route path="/projects/:projectId/log" element={<LogProgressPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;