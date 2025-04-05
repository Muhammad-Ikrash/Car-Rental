
import MiniCarCard from "./MiniCarCard";

import "./AllCardsDiv.css";


export default function AllCardsDiv() {

    const car1 = {
        name: "Nissan gtr Nismo",
        type: "Coupe",
        transmission: "Automatic/Manual",
        seater: 2,
        price: 50,
        rating: 4.8,
    };



    const car2 = {
        name: "Honda Accord",
        type: "Sedan",
        transmission: "Manual",
        seater: 5,
        price: 60,
        rating: 4.5,
    };

    const car3 = {

        name: "Ford Explorer",
        type: "SUV",
        transmission: "Automatic",
        seater: 7,
        price: 80,
        rating: 4.2,
    };
    const car4 = {
        name: "Chevrolet Tahoe",
        type: "SUV",
        transmission: "Automatic/Manual",
        seater: 8,
        price: 90,
        rating: 4.7,
    };

    const car5 = {
        name: "Nissan Altima",
        type: "Sedan",
        transmission: "Automatic",
        seater: 5,
        price: 70,
        rating: 4.3,
    };

    const car6 = {

        name: "Hyundai Elantra",
        type: "Sedan",
        transmission: "Manual",
        seater: 5,
        price: 55,
        rating: 4.1,
    };

    const car7 = {
        name: "Kia Sorento",
        type: "SUV",
        transmission: "Automatic",
        seater: 7,
        price: 85,
        rating: 4.6,
    };

    const car8 = {

        name: "Mazda CX-5",
        type: "SUV",
        transmission: "Automatic",
        seater: 5,
        price: 75,
        rating: 4.4,
    };
    const car = [car1, car2, car3, car4, car5, car6, car7, car8];


    return (
        <div className="allCardsDiv">
            {car.map((car, index) => (
                <MiniCarCard key={index} car={car} />
            ))}

        </div>
    );
}

