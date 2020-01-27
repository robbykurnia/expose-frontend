import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import NavBar from "./components/navBar";
import NotFound from "./components/notFound";
import Home from "./components/home";
import Profile from "./components/profile";
import Login from "./components/login";
import Logout from "./components/logout";
import Register from "./components/register";
import service from "./services/service";
import "./App.css";
import SearchPerson from "./components/searchPerson";
import About from "./components/about";
import Intro from "./components/intro";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { user: service.getCurrentUser() };
  }

  render() {
    const { user } = this.state;
    console.log("username di render: ", user);
    return (
      <div>
        <NavBar user={user} />
        <div className="container not-navbar mb-3 mt-5">
          <Switch>
            <Route
              path="/profile/:username?"
              render={props => <Profile {...props} user={user} />}
            />
            <Route
              path="/news"
              render={props => <Home {...props} user={user} />}
            />
            <Route
              path="/search/:username"
              render={props => <SearchPerson {...props} user={user} />}
            />
            {/* <Route path="/search/:username" exact component={SearchPerson} /> */}
            <Route path="/login" exact component={Login} />
            <Route path="/logout" exact component={Logout} />
            <Route path="/register" exact component={Register} />
            <Route path="/about" exact component={About} />
            <Route path="/" exact component={Intro} />
            <Route path="/not-found" component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
