
/*import navbar and Home */


import './HomePage.css';
import Home from './Home';
import Footer from './Footer';
import ScrollTop from './ScrollTop';
import Dashoard from './Dashboard';


export default function HomePage() {

    const id = 1; // Replace with the actual car ID you want to pass
    return (
        <div className="homepage">
            {/* <Navbar /> */}
            <Home />
            {/* <Dashoard carid={id} /> */}
            <Footer /> 
            <ScrollTop />

        </div>
    )
}   