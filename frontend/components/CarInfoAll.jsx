// import React, { useState, useEffect, useRef } from "react";
// import "./CarInfo.css";



// export default function CarInfoAll({ carId }) {
//   const [showForm, setShowForm] = useState(false);

//   const handleRentClick = () => {
//     setShowForm(true);
//   };
//   const carDetails = {
//     brand: "Nissan",
//     model: "Sentra",
//     year: 2022,
//     mileage: "32,000 km",
//     seats: 5,
//     rating: 4.3,
//     price: 42
//   };
//   const { brand, model, year, mileage, seats, rating, price } = carDetails;

//   const speedLimit = 120; // Example speed limit, you can change it as needed
//   const topSpeed = 200; // Example top speed, you can change it as needed

//   return (
//     <div className="carInfo">
//       {/* Image + overlay */}
//       <div className="oneDiv">
//         <div className="carImageContainer">
//             <img src='./homeImage2.jpg' alt="Car" className="carImage" />
//             <div className="carOverlay">
//                 <div className="infos"> {brand} | {model} </div>
//                 <div className="infos"> {year}</div>
//                 <div className="infos"> {mileage} driven</div>
//                 <div className="infos"> {seats} Seater</div>
//                 <div className="infos"> Automatic</div>
//                 <div className="infos"> Top Speed: {topSpeed} km/h</div>
//                 <div className="infos"> ⭐ {rating} / 5</div>
//                 <div className="infos"> ${price}/day </div>
//                 <div className="infos"> Available </div>
//             </div>

//         </div>
//         <div className="rightInfo">
//             <div className="reviewsDiv">Customer Reviews</div>
//             <div className="review">⭐ 4.9 "Impressive fuel economy, perfect for daily use."</div>
//             <div className="review">⭐ 4.7 "Handled the highway drive like a champ!"</div>
//             <div className="review">⭐ 4.8 "Plenty of space for luggage and passengers."</div>
//             <div className="review">⭐ 5.0 "Very comfortable seating even on long journeys."</div>
//             <div className="review">⭐ 4.6 "Great value compared to similar cars."</div>
//             <div className="review">⭐ 4.9 "Smooth steering and easy to maneuver in traffic."</div>
//         </div>
//       </div>

//       {/* Brief description + button */}
//       <div className="carSummary">
//         <p style={{ fontSize: "1.1em", fontWeight: "bold", fontFamily: "Varela Round"}}>
//           This Nissan Sentra is an excellent choice for city drives and long
//           trips alike. Fuel-efficient, stylish, and packed with safety features.
//         </p>
//         <button className="rentBtn" onClick={handleRentClick}>
//           Rent this Car
//         </button>
//       </div>

//       {/* Rent Form Placeholder */}
//       {showForm && (
//         <div className="rentForm">
//           <p>Rental form goes here...</p>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CarInfo.css";

export default function CarInfoAll({ id }) {
  const [showForm, setShowForm] = useState(false);
  const [carDetails, setCarDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const handleRentClick = () => {
    setShowForm(true);
  };

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cars/car/${id}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          setCarDetails(data[0]); // Assuming API response is an array with one car object
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching car data:", error);
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, []);

  if (loading) {
    return <div>Loading car details...</div>;
  }

  const { 
    Brand:brand,
    model: name,
    category,
    year,
    odometer_reading,
    no_seats: seats, 
    fuel_type, 
    features, 
    price_per_hour: price, 
    image_path: image, 
    car_status, 
    partner_company: partnerCompany ,
    
  } = carDetails;






  const rating = 4.8; // Example rating, can be set to some value or fetched from API

  console.log(carDetails.category.toLowerCase());

  


  return (
    <div className="carInfo">
      {/* Image + overlay */}
      <div className="oneDiv">
        <div className="carImageContainer">

          <img src={`/${carDetails.category.toLowerCase()}.png`} alt="Car" className="carImage"/>
          <div className="carOverlay">
            <div className="infos"> {carDetails.model} </div>
            <div className="infos"> {carDetails.year}</div>
            <div className="infos"> {carDetails.odometer_reading} driven</div>
            <div className="infos"> {carDetails.no_seats} Seater</div>
            <div className="infos"> Fuel Type: {carDetails.fuel_type}</div>
            <div className="infos"> ⭐ {rating} / 5</div>
            <div className="infos"> ${carDetails.price_per_hour}/hour </div>
            <div className="infos"> {carDetails.car_status} </div>
            <div className="infos"> {carDetails.partner_company} </div>
          </div>
        </div>

        <div className="rightInfo">
          <div className="reviewsDiv">Customer Reviews</div>
          <div className="review">⭐ 4.9 "Impressive fuel economy, perfect for daily use." 🚗</div>
          <div className="review">⭐ 4.7 "Handled the highway drive like a champ!" 🛣️</div>
          <div className="review">⭐ 4.8 "Plenty of space for luggage and passengers." 🎒</div>
          <div className="review">⭐ 5.0 "Very comfortable seating even on long journeys." 🛋️</div>
          <div className="review">⭐ 4.6 "Great value compared to similar cars." 💰</div>
          <div className="review">⭐ 4.9 "Smooth steering and easy to maneuver in traffic." 🌀</div>
        </div>
      </div>

      {/* Brief description + button */}
      <div className="carSummary">
        <p style={{ fontSize: "1.1em", fontWeight: "bold", fontFamily: "Varela Round" }}>
          {"Features: " + features || "This car is an excellent choice for city drives and long trips alike. Fuel-efficient, stylish, and packed with safety features."}
        </p>
        <button className="rentBtn" onClick={handleRentClick}>
          Rent this Car
        </button>
      </div>

      {/* Rent Form Placeholder */}
      {showForm && (
        <div className="rentForm">
          <p>Rental form goes here...</p>
        </div>
      )}
    </div>
  );
}
