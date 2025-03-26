import React,{useEffect} from "react";
import { Link } from "react-router-dom";
function About() {
    
  return (
    <div>
    <ul>
        <li>
          <Link to="/privacy-policy">Privacy Policy</Link>
        </li>
        <li>
          <Link to="/shipping-delivery">Shipping & Delivery</Link>
        </li>
        <li>
          <Link to="/refund-cancellation">Refund & Cancellation Policy</Link>
        </li>
        <li>
          <Link to="/terms-conditions">Terms & Conditions</Link>
        </li>
        <li>
          <Link to="/contactus">Contact Us</Link>
        </li>
      </ul>
    </div>
  );
}

export default About;