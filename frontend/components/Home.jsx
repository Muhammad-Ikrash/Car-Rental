
import AllCardsDiv from "./AllCardsDiv";
import "./Home.css";
import MiniCarCard from './MiniCarCard';
import Navbar from "./navbar";
import Filter from "./Filter";


export default function Home()
{

    return (
        <div className="home">

            <div className="homeImage">
                <Navbar />
                <img src="./bmw2.jpg" alt="ss"></img>
                <p className="imageText">Rent a Car for Every Journey</p>

            </div>
            <Filter />
            <div className="topPicksText">
                Top Picks for You
            </div>
            <div className="topPicksObjective">
                Experience the epitome of amazing journey with our top picks.
            </div>
            <AllCardsDiv />
            
        </div>
    )
} 