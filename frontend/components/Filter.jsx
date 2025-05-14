import React, { useState } from "react";
import { RiResetLeftFill } from "react-icons/ri";
import { FaArrowRightLong } from "react-icons/fa6";
import "./Filter.css";


//skibidi
export default function Filter({ onFilter }) {
    // Hardcoded brands (exactly as you requested)
    const brands = ['BMW', 'Toyota', 'Suzuki', 'Honda', 'Lamborghini', 
                   'Ferrari', 'Mercedes', 'Pagani', 'Bugatti', 'Kia', 
                   'Mazda', 'Nissan', 'Ford', 'Audi', 'Chevrolet',
                   'Hyundai', 'Porsche', 'Suzuki',];

    const models = {
        BMW: ['X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', '2 Series', '3 Series', 
              '4 Series', '5 Series', '7 Series', '8 Series', 'Z4', 'i8'],
        Toyota: ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', 
                'Prius', 'Avalon', 'Sienna', '4Runner', 'Sequoia', 'C-HR', 
                'Venza', 'Supra', 'GR86'],
        Suzuki: ['Swift', 'Baleno', 'Dzire', 'Vitara', 'Jimny', 'Ciaz', 
                'Ignis', 'S-Cross', 'Ertiga', 'XL6', 'Brezza', 'Alto', 
                'Wagon R', 'S-Presso', 'Celerio'],
        Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Ridgeline', 
                'Odyssey', 'Fit', 'Insight', 'Passport', 'Clarity', 'City', 
                'BR-V', 'Amaze', 'Brio'],
        Lamborghini: ['Aventador', 'Huracan', 'Urus', 'Sian', 'Countach', 
                     'Diablo', 'Murcielago', 'Gallardo', 'Reventon', 'Veneno', 
                     'Centenario', 'Terzo Millennio', 'Essenza SCV12', 
                     'Huracan Sterrato', 'Revuelto'],
        Ferrari: ['488', 'F8', 'Roma', 'Portofino', 'SF90', '296', 
                 '812', 'LaFerrari', 'Enzo', 'F40', 'F50', 'Monza', 
                 'Daytona SP3', 'Purosangue', 'Testarossa'],
        Mercedes: ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 
                  'GLC', 'GLE', 'GLS', 'G-Class', 'CLA', 'CLS', 'AMG GT', 
                  'SL', 'EQS', 'Maybach'],
        Pagani: ['Huayra', 'Zonda', 'Utopia', 'Huayra R', 'Zonda R', 
                'Huayra BC', 'Zonda Cinque', 'Huayra Roadster', 
                'Zonda F', 'Huayra Tempesta', 'Zonda Revolucion', 
                'Huayra Codalunga', 'Zonda HP Barchetta', 'Huayra Tricolore', 
                'Zonda Fantasma'],
        Bugatti: ['Chiron', 'Veyron', 'Divo', 'Centodieci', 'Bolide', 
                 'La Voiture Noire', 'Chiron Super Sport', 'Veyron Super Sport', 
                 'Chiron Pur Sport', 'EB110', 'Type 57', 'Veyron Grand Sport', 
                 'Chiron Sport', 'Chiron Profilée', 'Mistral'],
        Kia: ['Seltos', 'Soul', 'Forte', 'Rio', 'Optima', 'Stinger', 
              'Carnival', 'Sorento', 'Telluride', 'Sportage', 'Niro', 
              'EV6', 'K5', 'K900', 'Cadenza'],
        Mazda: ['Mazda3', 'Mazda6', 'CX-3', 'CX-30', 'CX-5', 'CX-9', 
                'MX-5 Miata', 'CX-50', 'CX-60', 'CX-70', 'CX-80', 
                'CX-90', 'RX-7', 'RX-8', 'MX-30'],
        Nissan: ['Altima', 'Maxima', 'Sentra', 'Versa', 'GT-R', '370Z', 
                 'Kicks', 'Rogue', 'Murano', 'Pathfinder', 'Armada', 
                 'Frontier', 'Titan', 'Leaf', 'Ariya'],
        Ford: ['F-150', 'Mustang', 'Explorer', 'Escape', 'Edge',  
               'Bronco', 'Ranger', 'Expedition', 'Maverick', 'Focus', 
               'Fusion', 'EcoSport', 'Transit', 'GT', 'Thunderbird'],

        Audi: ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7',
               'Q8', 'TT', 'R8', 'e-tron', 'Q4 e-tron', 'A1'],
        Chevrolet: ['Silverado', 'Malibu', 'Equinox', 'Traverse', 
                    'Tahoe', 'Suburban', 'Camaro', 'Corvette', 
                    'Blazer', 'Trailblazer', 'Sonic', 'Impala', 
                    'Cruze', 'Spark', 'Bolt EV'],
        Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona',
                    'Santa Cruz', 'Palisade', 'Ioniq 5', 'Veloster', 
                    'Accent', 'Genesis', 'Azera', 'Tucson N Line', 
                    'Sonata N Line', 'Kona N'],
        Porsche: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan',
                    'Boxster', 'Cayman', '918 Spyder', 'Carrera GT', 
                    'Porsche 718', 'Porsche 944', 'Porsche 928', 
                    'Porsche Macan EV', 'Porsche Cayenne Coupe', 
                    'Porsche Panamera Sport Turismo'],
        Suzuki: ['Swift', 'Baleno', 'Vitara', 'Jimny', 'Celerio',
                  'S-Cross', 'Ertiga', 'Alto', 'Wagon R', 'Brezza', 
                  'Ignis', 'XL6', 'Ciaz', 'Kizashi', 'Grand Vitara']
    };

    const years = Array.from({ length: 24 }, (_, i) => (2000 + i).toString());
    const types = ['SUV', 'Sedan', 'Truck', 'Van', 'Coupe', 'Convertible', 'Hatchback'];
    const seatOptions = [2, 4, 5, 7, 8];

    // State management
    const [filters, setFilters] = useState({
        brand: '',
        model: '',
        year: '',
        type: '',
        transmission: '',
        seats: [],
        minPrice: '',
        maxPrice: '',
        driverOption: ''
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Handler functions
    const handleInputChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'brand' && { model: '' }) // Reset model when brand changes
        }));
    };

    const handleSeatToggle = (seat) => {
        setFilters(prev => ({
            ...prev,
            seats: prev.seats.includes(seat)
                ? prev.seats.filter(s => s !== seat)
                : [...prev.seats, seat]
        }));
    };

    const handleFilterSubmit = async () => {
        setError(null);
        setIsLoading(true);
        
        try {
            const filterData = {
                brand: filters.brand,
                model: filters.model,
                year: filters.year,
                type: filters.type,
                transmission: filters.transmission,
                noOfSeats: filters.seats.join(','),
                minPrice: filters.minPrice || 0,
                maxPrice: filters.maxPrice || 10000,
                driverOption: filters.driverOption
            };


            //make new array filteredArray which only contains the above variables that are not null

            const filteredArray = Object.entries(filterData).reduce((acc, [key, value]) => {
                if (value !== '' && value !== 0 && value !== '0' && value !== '10000') {
                    acc[key] = value;
                }
                return acc;
            }, {});

            const response = await fetch('http://localhost:5000/api/cars/filter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filteredArray)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to filter cars');
            }

            const filteredCars = await response.json();
            onFilter(filteredCars);
            //console.log('Filteredssss Cars:', filteredCars);

        } catch (error) {
            console.error('Error filtering cars:', error);
            setError(error.message || 'Failed to filter cars. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFilters({
            brand: '',
            model: '',
            year: '',
            type: '',
            transmission: '',
            seats: [],
            minPrice: '',
            maxPrice: '',
            driverOption: ''
        });
        setError(null);
        onFilter(null);
    };

    return (
        <div className="filterDiv">
            <div className="row1">
                <div className="brand">
                    <div>Brand</div>
                    <select
                        value={filters.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                    >
                        <option value="">Select Brand</option>
                        {brands.map((brand, index) => (
                            <option key={index} value={brand}>{brand}</option>
                        ))}
                    </select>
                </div>

                <div className="model">
                    <div>Model</div>
                    <select
                        value={filters.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        disabled={!filters.brand}
                    >
                        <option value="">Select Model</option>
                        {filters.brand && models[filters.brand]?.map((model, index) => (
                            <option key={index} value={model}>{model}</option>
                        ))}
                    </select>
                </div>

                <div className="year">
                    <div>Year</div>
                    <select
                        value={filters.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                    >
                        <option value="">Select Year</option>
                        {years.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="type">
                    <div>Type</div>
                    <select
                        value={filters.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                    >
                        <option value="">Select Type</option>
                        {types.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row2">
                <div className="filterDriver">
                    <div>Filter Driver</div>
                    <button
                        className={`driver-btn ${filters.driverOption === 'with' ? 'active' : ''}`}
                        onClick={() => handleInputChange('driverOption', filters.driverOption === 'with' ? '' : 'with')}
                    >
                        With Driver
                    </button>
                    <button
                        className={`driver-btn ${filters.driverOption === 'without' ? 'active' : ''}`}
                        onClick={() => handleInputChange('driverOption', filters.driverOption === 'without' ? '' : 'without')}
                    >
                        Without Driver
                    </button>
                </div>

                <div className="filterTransmission">
                    <div>Transmission</div>
                    <button
                        className={`driver-btn ${filters.transmission === 'Automatic' ? 'active' : ''}`}
                        onClick={() => handleInputChange('transmission', filters.transmission === 'Automatic' ? '' : 'Automatic')}
                    >
                        Automatic
                    </button>
                    <button
                        className={`driver-btn ${filters.transmission === 'Manual' ? 'active' : ''}`}
                        onClick={() => handleInputChange('transmission', filters.transmission === 'Manual' ? '' : 'Manual')}
                    >
                        Manual
                    </button>
                </div>
            </div>

            <div className="row3">
                <div className="seats">
                    <div className="label-and-buttons">
                        <span className="label">Seats</span>
                        <div className="button-group">
                            {seatOptions.map((seat) => (
                                <button
                                    key={seat}
                                    className={`circle-btn ${filters.seats.includes(seat) ? 'active' : ''}`}
                                    onClick={() => handleSeatToggle(seat)}
                                >
                                    {seat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="price">
                    <div>Price $/day</div>
                    <input 
                        type="number" 
                        placeholder="From" 
                        value={filters.minPrice}
                        onChange={(e) => handleInputChange('minPrice', e.target.value)}
                    />
                    <input 
                        type="number" 
                        placeholder="To" 
                        value={filters.maxPrice}
                        onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                    />
                </div>

                <div className="reset">
                    <button className="resetButton" onClick={handleReset}>
                        Reset All <RiResetLeftFill className="icons"/>
                    </button>
                </div>

                <div className="search">
                    <button 
                        className="searchButton" 
                        onClick={handleFilterSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Searching...' : 'Search'} 
                        <FaArrowRightLong className="icons"/>
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-message" style={{ 
                    color: 'red', 
                    margin: '10px 0',
                    textAlign: 'center',
                    padding: '10px',
                    backgroundColor: '#ffeeee',
                    borderRadius: '5px'
                }}>
                    {error}
                </div>
            )}
        </div>
    );
}