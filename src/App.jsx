import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AnimatedBackground from './layout/AnimatedBackground';
import PrivateRoute from './components/common/PrivateRoute';
import ServerDashboard from './pages/ServerDashboard';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const ProjectListPage = lazy(() => import('./pages/ProjectList'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="App">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<AnimatedBackground />}>
                  <Route index element={<LoginPage />} />
                  <Route
                    path="projects"
                    element={
                      <PrivateRoute>
                        <ProjectListPage />
                      </PrivateRoute>
                    }
                  />
                </Route>
                <Route
                  path="project/:projectId"
                  element={
                    <PrivateRoute>
                      <ProjectPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="dashboard/:deviceId"
                  element={
                    <PrivateRoute>
                      <ServerDashboard />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
