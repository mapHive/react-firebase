import React from "react";
import "./app.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./home";
import Login from "./login";
import SignUp from "./signup";
import { AuthProvider } from "./auth";
import PrivateRoute from "./privateRoute";
import Database from "./database";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/database" component={Database} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
