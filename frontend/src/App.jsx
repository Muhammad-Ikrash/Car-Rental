import { useState, Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoadingLogo from '../components/LoadingLogo';

const HomePage = lazy(() => import("../components/HomePage"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const BugPage = lazy(() => import("../components/BugPage"));
const LoginSignup = lazy(() => import("../components/login"));

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const userData = sessionStorage.getItem('user');
    return userData ? !!JSON.parse(userData).id : false;
  });

  return (
    <div>
      <Router>
        <Suspense fallback={<LoadingLogo />}>
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />} 
            />
            <Route 
              path="/AdminDashboard" 
              element={<AdminDashboard />} 
            />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <LoginSignup onLogin={() => setIsAuthenticated(true)} />
                )
              } 
            />

            
          


            <Route path="/bugpage" element={<BugPage />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}