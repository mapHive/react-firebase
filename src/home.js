import React from "react";
import app from "./base";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1>Home</h1>
      <Link to="/database">Form</Link>
      <button onClick={() => app.auth().signOut()}>Sign Out</button>
    </>
  );
};

export default Home;
