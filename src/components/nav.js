import React from "react";
import { Link } from "react-router-dom";
import "../app.css";

const navStyles = {
  color: "white",
  textDecoration: "none",
};

function Nav() {
  return (
    <nav>
      <h3>
        <Link style={navStyles} to="/">
          Home
        </Link>
      </h3>
      <ul className="nav-links">
        <Link style={navStyles} to="./covid-check-register">
          COVID Check
        </Link>
        <Link style={navStyles} to="./covid-check-entries">
          COVID Check Entries
        </Link>
        <Link style={navStyles} to="./bookings">
          Bookings
        </Link>
      </ul>
    </nav>
  );
}

export default Nav;
