import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AnimatedBackground from './layout/AnimatedBackground';
import PrivateRoute from './components/common/PrivateRoute';
import ProjectPage from './pages/ProjectPage';
import ServerDashboard from './pages/ServerDashboard';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProjectDashboardPage = lazy(() => import('./pages/ProjectDashboard'));

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
                  element={
                    <PrivateRoute>
                      <ProjectDashboardPage />
                    </PrivateRoute>
                  }
                />
              </Route>
              <Route
                path="dashboard/:deviceId"
                element={
                  <PrivateRoute>
                    <ServerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="project/:projectId/edit"
                element={
                  <PrivateRoute>
                    <ProjectPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="project/:projectId"
                element={
                  <PrivateRoute>
                    <ProjectPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
