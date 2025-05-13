
// import MiniCarCard from "./MiniCarCard";
// import { useNavigate } from 'react-router-dom';
// import "./AllCardsDiv.css";


// export default function AllCardsDiv() {

//     const navigate = useNavigate();

//     const handleCardClick = (carid) => {
//         navigate(`/dashboard/${carid}`);
//     };

//     const car1 = {
//         id :1002,
//         name: "Nissan gtr Nismo",
//         type: "Coupe",
//         transmission: "Automatic",
//         seater: 2,
//         price: 50,
//         rating: 4.8,
//     };



//     const car2 = {
//         id :1,
//         name: "Honda Accord",
//         type: "Sedan",
//         transmission: "Manual",
//         seater: 5,
//         price: 60,
//         rating: 4.5,
//     };

//     const car3 = {
//         id :1,
//         name: "Ford Explorer",
//         type: "SUV",
//         transmission: "Automatic",
//         seater: 7,
//         price: 80,
//         rating: 4.2,
//     };
//     const car4 = {
//         id :1,
//         name: "Chevrolet Tahoe",
//         type: "SUV",
//         transmission: "Automatic",
//         seater: 8,
//         price: 90,
//         rating: 4.7,
//     };

//     const car5 = {
//         id :1,
//         name: "Nissan Altima",
//         type: "Sedan",
//         transmission: "Automatic",
//         seater: 5,
//         price: 70,
//         rating: 4.3,
//     };

//     const car6 = {
//         id :1,
//         name: "Hyundai Elantra",
//         type: "Sedan",
//         transmission: "Manual",
//         seater: 5,
//         price: 55,
//         rating: 4.1,
//     };

//     const car7 = {
//         id :1,
//         name: "Kia Sorento",
//         type: "SUV",
//         transmission: "Automatic",
//         seater: 7,
//         price: 85,
//         rating: 4.6,
//     };

//     const car8 = {
//         id :1,
//         name: "Mazda CX-5",
//         type: "SUV",
//         transmission: "Automatic",
//         seater: 5,
//         price: 75,
//         rating: 4.4,
//     };
//     const car = [car1, car2, car3, car4, car5, car6, car7, car8];


    
//     return (
//         <div className="allCardsDiv">
//             {car.map((car, index) => (
//                 <div className="card"
//                     key={index} 
//                     onClick={() => handleCardClick(car.id)} // Assuming each car object has an 'id' property
//                     style={{ cursor: 'pointer' }} // Optional: to show it's clickable
//                 >
//                     <MiniCarCard car={car} />
//                 </div>
//             ))}
//         </div>
//     );
// }

import MiniCarCard from "./MiniCarCard";
import { useNavigate } from 'react-router-dom';
import "./AllCardsDiv.css";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AllCardsDiv({ filterCriteria }) {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleCardClick = (carid) => {
        navigate(`/dashboard/${carid}`);
    };

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true);
                let url = 'http://localhost:5000/api/cars';
                
                // If filter criteria exists, use the filter endpoint
                if (filterCriteria) {
                    url = 'http://localhost:5000/api/cars/filter';
                    const response = await axios.post(url, filterCriteria);
                    setCars(response.data);
                } else {
                    // Fetch all cars if no filter
                    const response = await axios.get(url);
                    setCars(response.data);
                }
            } catch (error) {
                console.error('Error fetching cars:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, [filterCriteria]);

    if (loading) {
        return <div>Loading cars...</div>;
    }

    if (cars.length === 0) {
        return <div>No cars found matching your criteria.</div>;
    }

    return (
        <div className="allCardsDiv">
            {cars.map((car, index) => (
                <div className="card"
                    key={index} 
                    onClick={() => handleCardClick(car.id)}
                    style={{ cursor: 'pointer' }}
                >
                    <MiniCarCard car={car} />
                </div>
            ))}
        </div>
    );
}