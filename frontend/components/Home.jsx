
import AllCardsDiv from "./AllCardsDiv";
import "./Home.css";
import MiniCarCard from './MiniCarCard';
import Navbar from "./navbar";


export default function Home()
{
    console.log("Home");
 
    /*car object having name(toyota yaris etc), type(suv/sedan/hatchback etc), transmission type(auto/manual/), seater(5,7), price per day dollars */

    
 

    return (
        <div className="home">

            <div className="homeImage">
                <Navbar />
                <img src="./bmw2.jpg" alt="ss"></img>
                <p className="imageText">Rent a Car for Every Journey</p>

            </div>

            <AllCardsDiv />
            
        </div>
    )
} 