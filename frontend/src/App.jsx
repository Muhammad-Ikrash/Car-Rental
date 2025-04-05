import { useState } from 'react';
import   {Suspense, lazy} from 'react';
import './App.css';
 import LoadingLogo from '../components/LoadingLogo';
import Navbar from '../components/navbar';



const BugPage = lazy(() => new Promise(resolve => setTimeout(() => resolve(import("../components/BugPage.jsx")), 4000)));

const HomePage = lazy(() => new Promise(resolve => setTimeout(() => resolve(import("../components/HomePage.jsx")), 0)));


export default function App() {
  return (

    <div>

      <Suspense fallback={<LoadingLogo/>}>
      
      <HomePage />

      </Suspense>


    </div>
  )
};


