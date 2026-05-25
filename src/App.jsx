import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AddProjectPage from "./pages/AddProjectPage";
import Dashboard from "./pages/Dashboard";
import InspirationPage from "./pages/InspirationPage";
import LogProgressPage from "./pages/LogProgressPage";
import LoginPage from "./pages/LoginPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import RegisterPage from "./pages/RegisterPage";
import RoulettePage from "./pages/RoulettePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
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