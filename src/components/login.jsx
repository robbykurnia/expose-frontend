import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";
import { apiUrl } from "../config.json";
import service from "../services/service";
import SwalAlert from "../services/SwalAlert";

const urlEndPoint = apiUrl;
const tokenKey = "token";

class Login extends Component {
  constructor(props) {
    super(props);
    this.email = React.createRef();
    this.password = React.createRef();
  }

  state = { disabledButton: true, isLoading: false };

  handleChange = () => {
    const email = this.email.current.value;
    const password = this.password.current.value;

    if (email.length !== 0 && password.length !== 0)
      this.setState({ disabledButton: false });
    else this.setState({ disabledButton: true });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ isLoading: true });

    const email = this.email.current.value;
    const password = this.password.current.value;
    const requestBody = {
      query: `
        mutation{
          login(input:{email:"${email}", password:"${password}"})
        }
      `
    };

    fetch(urlEndPoint, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        return res.json();
      })
      .then(user => {
        this.setState({ isLoading: false });
        if (user.errors) {
          const errorMessage = user.errors[0].message;
          return SwalAlert.warning(errorMessage, "warning");
        } else {
          const data = JSON.stringify(user.data.login).split(" ");
          const jwt = data[1];
          localStorage.setItem(tokenKey, jwt);
          return (window.location = "/news");
        }
      });
  };

  render() {
    if (service.getCurrentUser()) return <Redirect to="/feed" />;
    return (
      <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            ref={this.email}
            autoComplete="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            ref={this.password}
            autoComplete="current-password"
          />
        </div>
        <div className="mb-3">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={this.state.disabledButton}
        >
          Submit
        </button>
        {this.state.isLoading && (
          <ReactLoading type={"bars"} color={"#007bff"} className="mx-auto" />
        )}
      </form>
    );
  }
}
export default Login;
