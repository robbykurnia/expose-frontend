import { Component } from "react";
import service from "../services/service";

class Logout extends Component {
  componentDidMount() {
    service.logout();

    window.location = "/login";
  }
  render() {
    return null;
  }
}

export default Logout;
