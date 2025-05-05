
import { useState, useEffect } from 'react'
import Navbar from './navbar'
import Footer from './Footer'
import './Dashboard.css'
import ScrollTop from './ScrollTop'
import CarInfoAll from './CarInfoAll'

export default function Dashoard({carid}){

    const [car, setCar] = useState([])

    return (
        <div className="dashboard">
            <Navbar />
           
            <CarInfoAll/>



        </div>
    )
}