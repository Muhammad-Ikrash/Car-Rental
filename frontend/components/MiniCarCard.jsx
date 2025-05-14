// import "./MiniCarCard.css";
// import { TbManualGearbox } from "react-icons/tb";
// import { GiCarSeat } from "react-icons/gi";
// import { FaRegStar } from "react-icons/fa";
// import { TiStarFullOutline } from "react-icons/ti";




// export default function MiniCarCard({car})
// {
//     console.log(car);
//     const { name, category, transmission, seater, price, rating } = car;
   
//     const imagePath = `./${category.toLowerCase()}.png`;


//     return(

//         <div className="singleCarCard" >

//             <div className="singleCardImageContainer">
//                 <img src={imagePath} alt="ss"></img>
//                 <p className="carType">{category}</p>
//             </div>

//             <div className="carName">
//                 {name}
//             </div>

//             <div className="carTransmission"  >
//                 <TbManualGearbox className="icons"/> {transmission}
//             </div>

//             <div className="seaterRating">
//                 <pre>
//                     <GiCarSeat className="icons"/> {seater}  <FaRegStar className="icons" /> {rating}
//                 </pre>
               
//             </div>

//             <div className="carPrice">
//                 <p style={{ fontSize: "0.9rem" }}>Start from</p>
//                 <p>
//                     <span style={{ fontWeight: "bold", color: "black" }}>${price}</span>
//                     <span style={{ fontSize: "0.75rem", marginLeft: "4px" }}> /day</span>
//                 </p>
//             </div>


//         </div>

//     );
// }


import "./MiniCarCard.css";
import { TbManualGearbox } from "react-icons/tb";
import { GiCarSeat } from "react-icons/gi";
import { FaRegStar } from "react-icons/fa";
import { TiStarFullOutline } from "react-icons/ti";


export default function MiniCarCard({ car }) {
    // Destructure with API property names and rename for component use
    const {
        model: name,
        category,
        transmission,
        no_seats: seater,
        price_per_hour: price,
        Brand: brand,
        car_id: id,
        image_path,
        year,
        color,
        fuel_type,
        features
    } = car;


    //const ratings = {4.3, 4.1, 4.6, 4.4, 4.5, 4.2, 4.7, 4.8}; fix this
    
    // Use the actual image path from API if available, otherwise fallback to category
    const imagePath = `./${category.toLowerCase()}.png`;

    return (
        <div className="singleCarCard">
            <div className="singleCardImageContainer">
                <img src={imagePath} alt={name} />
                <p className="carType">{category}</p>
            </div>

            <div className="carName">
                {name} {brand && `(${brand})`}
            </div>

            <div className="carDetails">
                <div className="carTransmission">
                    <TbManualGearbox className="icons" /> {transmission}
                </div>

                <div className="seaterRating">
                    <GiCarSeat className="icons" /> {seater} seats
                </div>

                <div className="carRating" style={{ color: "black" }}>
                    {/* <FaRegStar className="icons" /> 4.5  */}
                    <TiStarFullOutline className="icons" /> 4.5
                </div>
            </div>

            <div className="carPrice">
                <p style={{ fontSize: "0.9rem" }}>Start from</p>
                <p>
                    <span style={{ fontWeight: "bold", color: "black" }}>${price}</span>
                    <span style={{ fontSize: "0.75rem", marginLeft: "4px" }}> /hour</span>
                </p>
            </div>
        </div>
    );
}