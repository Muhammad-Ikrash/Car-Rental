// import { useState } from 'react';
// import   {Suspense, lazy} from 'react';
// import './App.css';
//  import LoadingLogo from '../components/LoadingLogo';
// import Navbar from '../components/navbar';



// const BugPage = lazy(() => new Promise(resolve => setTimeout(() => resolve(import("../components/BugPage.jsx")), 4000)));

// const HomePage = lazy(() => new Promise(resolve => setTimeout(() => resolve(import("../components/HomePage.jsx")), 0)));


// export default function App() {
//   return (

//     <div>

//       <Suspense fallback={<LoadingLogo/>}>
      
//       <HomePage />

//       </Suspense>


//     </div>
//   )
// };


// import { useState, Suspense, lazy } from 'react';
// import './App.css';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Updated import for React Router v6
// import LoadingLogo from '../components/LoadingLogo'; // Import your loading logo component
// import Navbar from '../components/navbar'; // Assuming you want to keep the navbar

// // Lazy loading for HomePage, BugPage, and Dashboard components
// const HomePage = lazy(() => import("../components/HomePage"));
// const Dashboard = lazy(() => import("../components/Dashboard"));
// const BugPage = lazy(() => import("../components/BugPage"));

// export default function App() {
//   return (
//     <div>
//       {/* Router Setup */}
//       <Router>
//         <Suspense fallback={<LoadingLogo />}>
//           {/* Navbar for navigation */}

          
//           {/* Routes component to handle different routes */}
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/dashboard/:carid" element={<Dashboard />} />
//             <Route path="/bugpage" element={<BugPage />} />
//           </Routes>
//         </Suspense>
//       </Router>
//     </div> 
//   );
// }


// import { useState, Suspense, lazy } from 'react';
// import './App.css';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import LoadingLogo from '../components/LoadingLogo';
// import Navbar from '../components/navbar';

// const HomePage = lazy(() => import("../components/HomePage"));
// const Dashboard = lazy(() => import("../components/Dashboard"));
// const BugPage = lazy(() => import("../components/BugPage"));
// const LoginSignup = lazy(() => import("../components/login"));

// export default function App() {
//   // const [isAuthenticated, setIsAuthenticated] = useState(
//   //   !!sessionStorage.getItem('user')
//   // );
//   // Add this helper function at the top of App.jsx
// const checkAuth = () => {
//   const userData = sessionStorage.getItem('user');
//   if (userData) {
//     try {
//       const user = JSON.parse(userData);
//       return !!user.id; // Check if we have a valid user ID
//     } catch {
//       return false;
//     }
//   }
//   return false;
// };

// // Update the state initialization
// const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

//   return (
//     <div>
//       <Router>
//         <Suspense fallback={<LoadingLogo />}>
//           <Routes>
//             <Route 
//               path="/" 
//               element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} 
//             />
//             <Route path="/dashboard/:carid" element={<Dashboard />} />
//             <Route path="/bugpage" element={<BugPage />} />
//             <Route 
//               path="/login" 
//               element={
//                 isAuthenticated ? (
//                   <Navigate to="/" />
//                 ) : (
//                   <LoginSignup setIsAuthenticated={setIsAuthenticated} />
//                 )
//               } 
//             />
//           </Routes>
//         </Suspense>
//       </Router>
//     </div>
//   );
// }

import { useState, Suspense, lazy } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoadingLogo from '../components/LoadingLogo';
import { useEffect } from 'react';

const HomePage = lazy(() => import("../components/HomePage"));
const Dashboard = lazy(() => import("../components/Dashboard"));
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
              path="/dashboard/:carid" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
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