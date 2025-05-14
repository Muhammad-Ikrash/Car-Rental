import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Navbar from './navbar'
import Footer from './Footer'
import './Dashboard.css'
import ScrollTop from './ScrollTop'
import CarInfoAll from './CarInfoAll'

export default function Dashboard(){
    const { carid } = useParams();

    return (
        <div className="dashboard">
            <Navbar />
            <CarInfoAll id={carid}/>
        </div>
    )
} 