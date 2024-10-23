import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/common/PrivateRoute";
import AnimatedBackground from "./layout/AnimatedBackground";

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
// const ProjectPage = lazy(() => import("./pages/projects/ProjectPage"));

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* 퍼블릭 라우트 */}
            <Route
              path="/"
              element={
                <>
                  <AnimatedBackground />
                  <LoginPage />
                </>
              }
            />

            {/* 프라이빗 라우트 */}
            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <AnimatedBackground />
                  {/* <ProjectPage /> */}
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
