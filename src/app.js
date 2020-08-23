import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./home";
import Login from "./login";
import SignUp from "./signup";
import { AuthProvider } from "./auth";
import PrivateRoute from "./privateRoute";
import CovidCheckRegister from "./covid-check-register";
import CovidCheckEntries from "./covid-check-entries";
import "./app.css";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
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
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
