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
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/database" component={Database} />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
