import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./home";
import Login from "./login";
import SignUp from "./signup";
import { AuthProvider } from "./auth";
import PrivateRoute from "./privateRoute";
import Nav from "./components/nav";
import CovidCheckRegister from "./covid-check-register";
import CovidCheckEntries from "./covid-check-entries";
import BookingsScreen from "./bookings/bookings-screen";
import "./app.css";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Nav />
          <div className="main-container">
            <PrivateRoute exact path="/" component={Home} />
            <PrivateRoute
              exact
              path="/covid-check/register"
              component={CovidCheckRegister}
            />
            <PrivateRoute
              exact
              path="/covid-check/entries"
              component={CovidCheckEntries}
            />
            <PrivateRoute exact path="/bookings" component={BookingsScreen} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
