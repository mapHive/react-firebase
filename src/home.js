import React from "react";
import { Link } from "react-router-dom";
import app from "./base";

const Home = () => {
  return (
    <>
      <h1>Home</h1>
      {/* <Link to="/covid-check/register">Covid Check Form</Link>
      <Link to="covid-check/entries">Previous Entries</Link> */}
      <button onClick={() => app.auth().signOut()}>Sign Out</button>
    </>
  );
};

export default Home;
