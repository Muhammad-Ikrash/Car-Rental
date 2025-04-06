

import "./Navbar.css";
import { RiDashboard3Fill } from "react-icons/ri";
import { FaUserLarge } from "react-icons/fa6";
 

export default function Navbar() { 

    return (

        <div className="navbar">

            <div className="menu">
                <div className="navbarLogo"><img src="./logoSlim3.png" alt="logo"></img></div>
                <div>Rentals</div>
                <div>Dashboard</div>
                <div>Active Bookings</div>
                <div>History</div>
            </div>
                
            <div className="search">
                <input type="text" placeholder="Search your dreams..." />
            </div>

            <div className="loginButton">
                <button>Login</button>
            </div>
            <div className="signupButton">
                <button>Sign Up</button>
            </div>

        </div>
    )

}