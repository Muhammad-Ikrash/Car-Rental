import "./MiniCarCard.css";
import { TbManualGearbox } from "react-icons/tb";
import { GiCarSeat } from "react-icons/gi";
import { FaRegStar } from "react-icons/fa";
import { TiStarFullOutline } from "react-icons/ti";




export default function MiniCarCard({car})
{
    const { name, category, transmission, seater, price, rating } = car;
    //image path is type of car but lower case
    const imagePath = `./${category.toLowerCase()}.png`;


    return(

        <div className="singleCarCard" >

            <div className="singleCardImageContainer">
                <img src={imagePath} alt="ss"></img>
                <p className="carType">{category}</p>
            </div>

            <div className="carName">
                {name}
            </div>

            <div className="carTransmission"  >
                <TbManualGearbox className="icons"/> {transmission}
            </div>

            <div className="seaterRating">
                <pre>
                    <GiCarSeat className="icons"/> {seater}  <FaRegStar className="icons" /> {rating}
                </pre>
               
            </div>

            <div className="carPrice">
                <p style={{ fontSize: "0.9rem" }}>Start from</p>
                <p>
                    <span style={{ fontWeight: "bold", color: "black" }}>${price}</span>
                    <span style={{ fontSize: "0.75rem", marginLeft: "4px" }}> /day</span>
                </p>
            </div>


        </div>

    );
}

