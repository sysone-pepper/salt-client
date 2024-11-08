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
                path="project/"
                element={
                  <PrivateRoute>
                    <ProjectPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="dashboard/"
                element={
                  <PrivateRoute>
                    <ServerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="project-detail/:projectId"
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

// function App() {
//   return (
//     <Router>
//       <AuthProvider>
//         <div className="App">
//           <Suspense fallback={<div>Loading...</div>}>
//             <Routes>
//               <Route path="/" element={<AnimatedBackground />}>
//                 <Route index element={<LoginPage />} />
//                 <Route
//                   path="projects/:username"
//                   element={<ProjectDashboardPage />}
//                 />
//               </Route>
//               <Route path="project/" element={<ProjectPage />} />
//               <Route path="dashboard/" element={<ServerDashboard />} />
//               <Route
//                 path="project-detail/:projectId"
//                 element={<ProjectPage />}
//               />
//             </Routes>
//           </Suspense>
//         </div>
//       </AuthProvider>
//     </Router>
//   );
// }

export default App;
