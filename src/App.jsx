import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import AnimatedBackground from "./layout/AnimatedBackground";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const ProjectDashboardPage = lazy(() => import("./pages/ProjectDashboard"));

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<AnimatedBackground />}>
                <Route index element={<LoginPage />} />
                <Route
                  path="projects/:username"
                  element={<ProjectDashboardPage />}
                />
              </Route>
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
