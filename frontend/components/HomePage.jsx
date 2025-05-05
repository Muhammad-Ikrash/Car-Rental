
/*import navbar and Home */


import './HomePage.css';
import Home from './Home';
import Footer from './Footer';
import ScrollTop from './ScrollTop';
import Dashoard from './Dashboard';


export default function HomePage() {

    return (
        <div className="homepage">
            {/* <Navbar /> */}
            {/* <Home /> */}
            <Dashoard />
            <Footer />
            <ScrollTop />

        </div>
    )
} 