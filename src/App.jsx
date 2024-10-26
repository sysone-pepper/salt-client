import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import AnimatedBackground from "./layout/AnimatedBackground";

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const ProjectPage = lazy(() => import("./pages/projects/Projects"));

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<AnimatedBackground />}>
              <Route path="/" element={<LoginPage />} />
              <Route path="/projects" element={<ProjectPage />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
