
import React, { useState } from "react";
import { RiResetLeftFill } from "react-icons/ri";
import { FaArrowRightLong } from "react-icons/fa6";
import "./Filter.css";

export default function Filter(){
    const brands = ['BMW', 'Mercedes', 'Audi', 'Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia'];
    const modelsBMW = ['X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7'];
    const modelsMercedes = ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS'];
    const modelsAudi = ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8'];
    const modelsToyota = ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Tacoma', 'Tundra'];
    const modelsHonda = ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Ridgeline'];
    const modelsFord = ['F-150', 'Mustang', 'Explorer', 'Escape', 'Edge', 'Bronco'];
    const modelsChevrolet = ['Silverado', 'Malibu', 'Equinox', 'Traverse', 'Tahoe', 'Suburban'];
    const modelsNissan = ['Altima', 'Maxima', 'Rogue', 'Murano', 'Pathfinder', 'Armada'];
    const modelsHyundai = ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona', 'Palisaide'];
    const modelsKia = ['Forte', 'Optima', 'Sportage', 'Sorento', 'Telluride', 'Seltos'];
    const models = {
        BMW: modelsBMW,
        Mercedes: modelsMercedes,
        Audi: modelsAudi,
        Toyota: modelsToyota,
        Honda: modelsHonda,
        Ford: modelsFord,
        Chevrolet: modelsChevrolet,
        Nissan: modelsNissan,
        Hyundai: modelsHyundai,
        Kia: modelsKia
    };
    const years = ['2020', '2021', '2022', '2023'];
    const types = ['SUV', 'Sedan', 'Truck', 'Van', 'Coupe', 'Convertible', 'Hatchback'];
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [filteredModels, setFilteredModels] = useState([]);

    const [driverOption, setDriverOption] = useState(null); // "with" | "without"

    const handleDriverSelection = (option) => {
        setDriverOption((prev) => (prev === option ? null : option));
    };

    const [transmissionOption, setTransmissionOption] = useState(null);

    const handleTransmissionSelection = (option) => {
    setTransmissionOption(prev => (prev === option ? null : option));
    };

    const [selectedSeats, setSelectedSeats] = useState([]);
    const seatOptions = [2, 5, 7];

    const handleSeatClick = (seat) => {
        if (selectedSeats.includes(seat)) {
        setSelectedSeats(selectedSeats.filter((s) => s !== seat));
        } else {
        setSelectedSeats([...selectedSeats, seat]);
        }
    };
      
      

    const handleBrandChange = (event) => {
        const brand = event.target.value;
        setSelectedBrand(brand);
        setSelectedModel('');
        setFilteredModels(models[brand] || []);
    }

    const handleModelChange = (event) => {
        const model = event.target.value;
        setSelectedModel(model);
    }

    const handleYearChange = (event) => {
        const year = event.target.value;
        setSelectedYear(year);
    }

    const handleTypeChange = (event) => {
        const type = event.target.value;
        setSelectedType(type);
    }

    const handleFilter = () => {
        // Implement filter logic here based on selectedBrand, selectedModel, selectedYear, and selectedType
        console.log('Filter applied:', { selectedBrand, selectedModel, selectedYear, selectedType });
    }

    const handleReset = () => {
        setSelectedBrand('');
        setSelectedModel('');
        setSelectedYear('');
        setSelectedType('');
        setFilteredModels([]);
    }
    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredBrands = brands.filter(brand => brand.toLowerCase().includes(searchTerm));
        setFilteredModels(filteredBrands);
    }

    const handleModelSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredModels = models[selectedBrand].filter(model => model.toLowerCase().includes(searchTerm));
        setFilteredModels(filteredModels);
    }

    const handleYearSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredYears = years.filter(year => year.toLowerCase().includes(searchTerm));
        setFilteredModels(filteredYears);
    }
    const handleTypeSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredTypes = types.filter(type => type.toLowerCase().includes(searchTerm));
        setFilteredModels(filteredTypes);
    }

    const handleBrandClick = (brand) => {
        setSelectedBrand(brand);
        setFilteredModels(models[brand] || []);
    }

    const handleModelClick = (model) => {
        setSelectedModel(model);
    }

    const handleYearClick = (year) => {
        setSelectedYear(year);
    }

    const handleTypeClick = (type) => {
        setSelectedType(type);
    }

    const handleBrandKeyDown = (event) => {
        if (event.key === 'Enter') {
            const brand = event.target.value;
            setSelectedBrand(brand);
            setFilteredModels(models[brand] || []);
        }
    }

    const handleModelKeyDown = (event) => {
        if (event.key === 'Enter') {
            const model = event.target.value;
            setSelectedModel(model);
        }
    }

    const handleYearKeyDown = (event) => {
        if (event.key === 'Enter') {
            const year = event.target.value;
            setSelectedYear(year);
        }
    }

    const handleTypeKeyDown = (event) => {
        if (event.key === 'Enter') {
            const type = event.target.value;
            setSelectedType(type);
        }
    }


    return (
        <div className="filterDiv">
            <div className="row1">
                <div className="brand">
                    <div>Brand</div>
                    <div>
                        <select
                        name="brandselect"
                        id="brandselect"
                        value={selectedBrand}
                        onChange={handleBrandChange}
                        >
                        <option value="">Select Brand</option>
                        {brands.map((brand, index) => (
                            <option key={index} value={brand}>
                            {brand}
                            </option>
                        ))}
                        </select>
                    </div>
                    </div>

                    <div className="model">
                    <div>Model</div>
                    <div>
                        <select
                        name="modelselect"
                        id="modelselect"
                        value={selectedModel}
                        onChange={handleModelChange}
                        disabled={!selectedBrand}
                        >
                        <option value="">Select Model</option>
                        {filteredModels.map((model, index) => (
                            <option key={index} value={model}>
                            {model}
                            </option>
                        ))}
                        </select>
                    </div>
                    </div>

                    <div className="year">
                    <div>Year</div>
                    <div>
                        <select
                        name="yearselect"
                        id="yearselect"
                        value={selectedYear}
                        onChange={handleYearChange}
                        >
                        <option value="">Select Year</option>
                        {years.map((year, index) => (
                            <option key={index} value={year}>
                            {year}
                            </option>
                        ))}
                        </select>
                    </div>
                    </div>

                    <div className="type">
                    <div>Type</div>
                    <div>
                        <select
                        name="typeselect"
                        id="typeselect"
                        value={selectedType}
                        onChange={handleTypeChange}
                        >
                        <option value="">Select Type</option>
                        {types.map((type, index) => (
                            <option key={index} value={type}>
                            {type}
                            </option>
                        ))}
                        </select>
                    </div>
                    </div>

                </div>
            <div className="row2">
                <div className="filterDriver">
                    <div>Filter Driver</div>

                        <button
                        className={driverOption === 'with' ? 'driver-btn active' : 'driver-btn'}
                        onClick={() => handleDriverSelection('with')}
                        >
                        With Driver
                        </button>
                        <button
                        className={driverOption === 'without' ? 'driver-btn active' : 'driver-btn'}
                        onClick={() => handleDriverSelection('without')}
                        >
                        Without Driver
                        </button>
                </div>
                <div className="filterTransmission">
                    <div>Transmission</div>
                    <button
                        className={transmissionOption === 'automatic' ? 'driver-btn active' : 'driver-btn'}
                        onClick={() => handleTransmissionSelection('automatic')}
                    >
                        Automatic
                    </button>
                    <button
                        className={transmissionOption === 'manual' ? 'driver-btn active' : 'driver-btn'}
                        onClick={() => handleTransmissionSelection('manual')}
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
                            className={`circle-btn ${selectedSeats.includes(seat) ? "active" : ""}`}
                            onClick={() => handleSeatClick(seat)}
                            >
                            {seat}
                            </button>
                        ))}
                        </div>
                    </div>
                </div>
                

                <div className="price">
                    <div>Price $/day</div>
                    <input type="number" placeholder="From"/>
                    <input type="number" placeholder="To"/>
                </div>
                <div className="reset">
                    <button className="resetButton" onClick={handleReset}>
                        Reset All <RiResetLeftFill className="icons"/>
                    </button>
                </div>
                <div className="search">
                    <button className="searchButton" onClick={handleFilter}>
                        Search   <FaArrowRightLong className="icons"/>
                    </button>
                    
                </div>
            </div>
            
        </div>
    )
}