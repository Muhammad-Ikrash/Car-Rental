import './Footer.css';
import { FaInstagram, FaXTwitter, FaFacebookF, FaDiscord, FaTiktok } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="footer">
        <div className="footer-container">

            <div className='left'>
                <div className='company'>
                    <div className='carLogo'><img src="./thickLogo1.png" alt=""></img></div>
                    <div>Rentals</div>

                </div>
                <div className='mission'>
                Our mission is to provide seamless and affordable car rental experiences by offering a wide selection of reliable vehicles tailored to every journey.
                </div>

                <div className="copyright">
                    ©2024 Rentals. All rights reserved.
                </div>

            </div>


            <div className='about'>
                {/* <div>About</div>
                <div>About Us</div>
                <div>Blog</div>
                <div>Career</div> */}
               
                <div style={{color:'white'}}>About</div>

                <a href="#">About Us</a>
                <a href="#">Blog</a>
                <a href="#">Career</a>
               
               

            </div>


            <div className='support'>
                <div style={{color:'white'}}>Support</div>

                <a href="#">Contact Us</a>
                <a href="#">Return Policy</a>
                <a href="#">FAQ</a>

            </div>


            <div className='socials'>
                <div style={{marginLeft: '5%', fontSize: '20px', fontWeight: 'bold', border:'0px solid green'}}>
                    Get Updates
                </div>

                <div className='socials-icons'>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                    <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                    <a href="https://discord.com/" target="_blank" rel="noopener noreferrer"><FaDiscord /></a>
                    <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
                </div>

                <div className='terms'>
                    <pre>
                    <a href="#">Privacy Policy       </a><a href="">Terms of Service</a>
                    </pre>
                </div>

             
            </div>
        
        </div>
    </footer>
  );
}
