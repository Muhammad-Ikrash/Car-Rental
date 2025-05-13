
// import AllCardsDiv from "./AllCardsDiv";
// import "./Home.css";
// import MiniCarCard from './MiniCarCard';
// import Navbar from "./navbar";
// import Filter from "./Filter";
// import { useState,useEffect } from "react";

// export default function Home()
// {

//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const userData = JSON.parse(sessionStorage.getItem('user'));
//         setUser(userData);
//     }, []);

//     return (
//         <div className="home">

//             <div className="homeImage">
//                 <Navbar />
//                 <img src="./bmw2.jpg" alt="ss"></img>
//                 <p className="imageText">Rent a Car for Every Journey</p>

//             </div>
//             <Filter />
//             <div className="topPicksText">
//                 Top Picks for You
//             </div>
//             <div className="topPicksObjective">
//                 Experience the epitome of amazing journey with our top picks.
//             </div>
//             <AllCardsDiv />
            
//         </div>
//     )
// } 


import AllCardsDiv from "./AllCardsDiv";
import "./Home.css";
import Navbar from "./navbar";
import Filter from "./Filter";
import { useState } from "react";

export default function Home() {
    const [filterCriteria, setFilterCriteria] = useState(null);

    const handleFilter = (criteria) => {
        setFilterCriteria(criteria);
    };

    return (
        <div className="home">
            <div className="homeImage">
                <Navbar />
                <img src="./bmw2.jpg" alt="ss"></img>
                <p className="imageText">Rent a Car for Every Journey</p>
            </div>
            <Filter onFilter={handleFilter} />
            <div className="topPicksText">
                {filterCriteria ? 'Filter Results' : 'Top Picks for You'}
            </div>
            <div className="topPicksObjective">
                {filterCriteria 
                    ? 'Cars matching your criteria' 
                    : 'Experience the epitome of amazing journey with our top picks.'
                }
            </div>
            <AllCardsDiv filterCriteria={filterCriteria} />
        </div>
    );
}