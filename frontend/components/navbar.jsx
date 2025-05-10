

// import "./Navbar.css";
// import { RiDashboard3Fill } from "react-icons/ri";
// import { FaUserLarge } from "react-icons/fa6";
 

// export default function Navbar() { 

//     return (

//         <div className="navbar">

//             <div className="menu">
//                 <div className="navbarLogo"><img src="./logoSlim3.png" alt="logo"></img></div>
//                 <div>Rentals</div>
//                 <div>Dashboard</div>
//                 <div>Active Bookings</div>
//                 <div>History</div>
//             </div>
                
//             <div className="search">
//                 <input type="text" placeholder="Search your dreams..." />
//             </div>


            
//             <div className="loginButton">
//                 <button>Login</button>
//             </div>
//             <div className="signupButton">
//                 <button>Sign Up</button>
//             </div>

//         </div>
//     )

// }

import "./Navbar.css";
import { FaUserLarge } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login", { replace: true }); // Force redirect to login page
    window.location.reload(); // Ensure complete reset
    //print user to check if logged out
  };

  const handleProfile = () => {
    setShowDropdown(false);
    navigate("/profile");
  };

  return (
    <div className="navbar">
      <div className="menu">
        <div className="navbarLogo">
          <img src="./logoSlim3.png" alt="logo"></img>
        </div>
        <div>Rentals</div>
        <div>Dashboard</div>
        <div>Active Bookings</div>
        <div>History</div>
      </div>

      <div className="search">
        <input type="text" placeholder="Search your dreams..." />
      </div>

      {/* Login button always hidden */}
      <div className="loginButton hid">
        <button>Login</button>
      </div>

      {isLoggedIn ? (
        <div className="userDropdown">
          <button 
            className="userIconButton"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FaUserLarge />
          </button>
          {showDropdown && (
            <div className="dropdownMenu">
              <button onClick={handleProfile}>Profile</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      ) : (
        <div className="signupButton">
          <button onClick={() => navigate("/login")}>Sign Up</button>
        </div>
      )}
    </div>
  );
}