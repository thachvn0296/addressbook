import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import People from "./People";
import Organisations from "./Organisations";
import Home from "./Home";
import "./styles.scss";

const Admin = () => (
  <div>
    <h2>Welcome admin!</h2>
  </div>
);

export default function App() {
  return (
    <div>
      <nav className="navbar navbar-light">
        <ul className="nav navbar-nav">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/people">People Management</Link>
          </li>
          <li>
            <Link to="/organisation">Organisation Management</Link>
          </li> 
        </ul>
      </nav>
      <div className="content">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/people">
            <People />
          </Route>
          <Route path="/organisation">
            <Organisations />
          </Route>
        </Switch>
      </div>
    </div>
  );
}
