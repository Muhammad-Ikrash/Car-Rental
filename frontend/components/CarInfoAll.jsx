// // import React, { useState, useEffect, useRef } from "react";
// // import "./CarInfo.css";



// // export default function CarInfoAll({ carId }) {
// //   const [showForm, setShowForm] = useState(false);

// //   const handleRentClick = () => {
// //     setShowForm(true);
// //   };
// //   const carDetails = {
// //     brand: "Nissan",
// //     model: "Sentra",
// //     year: 2022,
// //     mileage: "32,000 km",
// //     seats: 5,
// //     rating: 4.3,
// //     price: 42
// //   };
// //   const { brand, model, year, mileage, seats, rating, price } = carDetails;

// //   const speedLimit = 120; // Example speed limit, you can change it as needed
// //   const topSpeed = 200; // Example top speed, you can change it as needed

// //   return (
// //     <div className="carInfo">
// //       {/* Image + overlay */}
// //       <div className="oneDiv">
// //         <div className="carImageContainer">
// //             <img src='./homeImage2.jpg' alt="Car" className="carImage" />
// //             <div className="carOverlay">
// //                 <div className="infos"> {brand} | {model} </div>
// //                 <div className="infos"> {year}</div>
// //                 <div className="infos"> {mileage} driven</div>
// //                 <div className="infos"> {seats} Seater</div>
// //                 <div className="infos"> Automatic</div>
// //                 <div className="infos"> Top Speed: {topSpeed} km/h</div>
// //                 <div className="infos"> ⭐ {rating} / 5</div>
// //                 <div className="infos"> ${price}/day </div>
// //                 <div className="infos"> Available </div>
// //             </div>

// //         </div>
// //         <div className="rightInfo">
// //             <div className="reviewsDiv">Customer Reviews</div>
// //             <div className="review">⭐ 4.9 "Impressive fuel economy, perfect for daily use."</div>
// //             <div className="review">⭐ 4.7 "Handled the highway drive like a champ!"</div>
// //             <div className="review">⭐ 4.8 "Plenty of space for luggage and passengers."</div>
// //             <div className="review">⭐ 5.0 "Very comfortable seating even on long journeys."</div>
// //             <div className="review">⭐ 4.6 "Great value compared to similar cars."</div>
// //             <div className="review">⭐ 4.9 "Smooth steering and easy to maneuver in traffic."</div>
// //         </div>
// //       </div>

// //       {/* Brief description + button */}
// //       <div className="carSummary">
// //         <p style={{ fontSize: "1.1em", fontWeight: "bold", fontFamily: "Varela Round"}}>
// //           This Nissan Sentra is an excellent choice for city drives and long
// //           trips alike. Fuel-efficient, stylish, and packed with safety features.
// //         </p>
// //         <button className="rentBtn" onClick={handleRentClick}>
// //           Rent this Car
// //         </button>
// //       </div>

// //       {/* Rent Form Placeholder */}
// //       {showForm && (
// //         <div className="rentForm">
// //           <p>Rental form goes here...</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import "./CarInfo.css";

// export default function CarInfoAll({ id }) {
//   const [showForm, setShowForm] = useState(false);
//   const [carDetails, setCarDetails] = useState({});
//   const [loading, setLoading] = useState(true);

//   const handleRentClick = () => {
//     setShowForm(true);
//   };

//   useEffect(() => {
//     const fetchCarDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/cars/car/${id}`);
//         const data = await response.json();
        
//         if (data && data.length > 0) {
//           setCarDetails(data[0]); // Assuming API response is an array with one car object
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching car data:", error);
//         setLoading(false);
//       }
//     };

//     fetchCarDetails();
//   }, []);

//   if (loading) {
//     return <div>Loading car details...</div>;
//   }

//   const { 
//     Brand:brand,
//     model: name,
//     category,
//     year,
//     odometer_reading,
//     no_seats: seats, 
//     fuel_type, 
//     features, 
//     price_per_hour: price, 
//     image_path: image, 
//     car_status, 
//     partner_company: partnerCompany ,
    
//   } = carDetails;






//   const rating = 4.8; // Example rating, can be set to some value or fetched from API

//   console.log(carDetails.category.toLowerCase());

  


//   return (
//     <div className="carInfo">
//       {/* Image + overlay */}
//       <div className="oneDiv">
//         <div className="carImageContainer">

//           <img src={`/${carDetails.category.toLowerCase()}.png`} alt="Car" className="carImage"/>
//           <div className="carOverlay">
//             <div className="infos"> {carDetails.model} </div>
//             <div className="infos"> {carDetails.year}</div>
//             <div className="infos"> {carDetails.odometer_reading} driven</div>
//             <div className="infos"> {carDetails.no_seats} Seater</div>
//             <div className="infos"> Fuel Type: {carDetails.fuel_type}</div>
//             <div className="infos"> ⭐ {rating} / 5</div>
//             <div className="infos"> ${carDetails.price_per_hour}/hour </div>
//             <div className="infos"> {carDetails.car_status} </div>
//             <div className="infos"> {carDetails.partner_company} </div>
//           </div>
//         </div>

//         <div className="rightInfo">
//           <div className="reviewsDiv">Customer Reviews</div>
//           <div className="review">⭐ 4.9 "Impressive fuel economy, perfect for daily use." 🚗</div>
//           <div className="review">⭐ 4.7 "Handled the highway drive like a champ!" 🛣️</div>
//           <div className="review">⭐ 4.8 "Plenty of space for luggage and passengers." 🎒</div>
//           <div className="review">⭐ 5.0 "Very comfortable seating even on long journeys." 🛋️</div>
//           <div className="review">⭐ 4.6 "Great value compared to similar cars." 💰</div>
//           <div className="review">⭐ 4.9 "Smooth steering and easy to maneuver in traffic." 🌀</div>
//         </div>
//       </div>

//       {/* Brief description + button */}
//       <div className="carSummary">
//         <p style={{ fontSize: "1.1em", fontWeight: "bold", fontFamily: "Varela Round" }}>
//           {"Features: " + features || "This car is an excellent choice for city drives and long trips alike. Fuel-efficient, stylish, and packed with safety features."}
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
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    locFrom: "",
    locTo: "",
    remarks: ""
  });
  const [totalCost, setTotalCost] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleRentClick = () => {
    setShowForm(true);
  };

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cars/car/${id}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          setCarDetails(data[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching car data:", error);
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  useEffect(() => {
    if (formData.startDate && formData.endDate && carDetails.price_per_hour) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const hours = (end - start) / (1000 * 60 * 60);
      const calculatedCost = hours * carDetails.price_per_hour;
      setTotalCost(calculatedCost.toFixed(2));
    }
  }, [formData.startDate, formData.endDate, carDetails.price_per_hour]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const bookingData = {
        clientID: 1, // Hardcoded as requested
        carID: id, // From the car details
        driverID: 1, // Assuming driver is included
        startDate: formData.startDate,
        endDate: formData.endDate,
        expectedCost: totalCost,
        locFrom: formData.locFrom,
        locTo: formData.locTo,
        remarks: formData.remarks,
        promotion: null,
        amount: totalCost,
        status: "Confirmed"
      };

      const response = await fetch('http://localhost:5000/api/bookings/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      setSuccess(true);
      // Reset form after successful submission
      setFormData({
        startDate: "",
        endDate: "",
        locFrom: "",
        locTo: "",
        remarks: ""
      });
      setTimeout(() => {
        setShowForm(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to submit booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading car details...</div>;
  }

  const { 
    model,
    category,
    year,
    odometer_reading,
    no_seats,
    fuel_type, 
    features, 
    price_per_hour, 
    car_status, 
    partner_company,
  } = carDetails;

  const rating = 4.8;

  return (
    <div className="carInfo">
      {/* Image + overlay */}
      <div className="oneDiv">
        <div className="carImageContainer">
          <img src={`/${category.toLowerCase()}.png`} alt="Car" className="carImage"/>
          <div className="carOverlay">
            <div className="infos"> {model} </div>
            <div className="infos"> {year}</div>
            <div className="infos"> {odometer_reading} driven</div>
            <div className="infos"> {no_seats} Seater</div>
            <div className="infos"> Fuel Type: {fuel_type}</div>
            <div className="infos"> ⭐ {rating} / 5</div>
            <div className="infos"> ${price_per_hour}/hour </div>
            <div className="infos"> {car_status} </div>
            <div className="infos"> {partner_company} </div>
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

      {/* Rental Form */}
      {showForm && (
        <div className="rentForm">
          <h3>Book This Vehicle</h3>
          
          {success && (
            <div className="success-message">
              Booking successful! Redirecting...
            </div>
          )}
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Start Date & Time:</label>
              <input
                type="datetime-local"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>End Date & Time:</label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                min={formData.startDate}
              />
            </div>
            
            <div className="form-group">
              <label>Pickup Location:</label>
              <input
                type="text"
                name="locFrom"
                value={formData.locFrom}
                onChange={handleInputChange}
                placeholder="Enter pickup address"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Drop-off Location:</label>
              <input
                type="text"
                name="locTo"
                value={formData.locTo}
                onChange={handleInputChange}
                placeholder="Enter drop-off address"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Special Requests:</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                placeholder="Any special requirements?"
              />
            </div>
            
            <div className="cost-summary">
              <h4>Booking Summary</h4>
              <p>Car: {model} ({year})</p>
              <p>Rate: ${price_per_hour}/hour</p>
              <p>Total Hours: {
                formData.startDate && formData.endDate 
                  ? ((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60)): 0
              }</p>
              <p className="total-cost">Total Cost: ${totalCost}</p>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}