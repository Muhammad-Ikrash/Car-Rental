import { useState,useEffect } from "react";

import "./LoadingLogo.css";


export default function LoadingLogo(){

    return(
        <div className="loading-logo" >
            <img src="./logo.png" alt="Loading..." />
        </div>
    )

}