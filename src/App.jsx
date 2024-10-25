import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import AnimatedBackground from "./layout/AnimatedBackground";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const ProjectDashboardPage = lazy(() => import("./pages/ProjectDashboard"));

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<AnimatedBackground />}>
              <Route path="/" element={<LoginPage />} />
              <Route path="/projects" element={<ProjectDashboardPage />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
