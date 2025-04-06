import React, { useState, useEffect } from 'react';
import './ScrollTop.css';
import { FaArrowUp } from "react-icons/fa";

export default function MoveTop() {
  // State to control visibility of the button
  const [isVisible, setIsVisible] = useState(false);

  // Check scroll position on page scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 270) { // Show button after 270px scroll
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll to the top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', //options: auto, smooth, instant, inherit
    });
  };

  return (
    <button className={`scroll-to-top ${isVisible ? 'show' : ''}`} onClick={scrollToTop}>
      <FaArrowUp className="scroll-icon" />
    </button>
  );
};


