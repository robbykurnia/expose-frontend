import React, { Component } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
// import { NavBar } from "react-bootstrap";
import { getUser } from "./../services/service";
import SearchTypehead from "./common/searchTypehead";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onClickInput: false,
      searchInput: "",
      onEnter: false,
      pushEnter: false,
      showInput: false,
      persons: [
        // { id: 1, username: "robby" },
        // { id: 2, username: "robby" },
        // { id: 3, username: "robby" }
      ]
    };
  }

  onKeyDown = e => {
    // console.log(e.key);
    if (e.key === "Enter") {
      e.preventDefault();
      if (this.state.searchInput.length === 0) return;
      if (this.state.persons.length > 0) {
        this.props.history.push({
          pathname: `/profile/${this.state.persons[0].username}`
        });
        this.setState({ searchInput: "", persons: [] });
      }
      if (this.state.persons.length === 0) {
        this.props.history.push({
          pathname: `/search/${this.state.searchInput}`
        });
        this.setState({ searchInput: "", persons: [] });
      }
    }
  };

  onClickBackdrop = () => {
    this.setState({
      searchInput: "",
      persons: [],
      onClickInput: false,
      showInput: false
    });
  };

  onClickInput = () => {
    // console.log("onClickInput");
    this.setState({ onClickInput: true });
  };

  onClick = () => {
    this.setState({ searchInput: "", persons: [], onClickInput: false });
  };

  onChange = e => {
    const searchInput = e.currentTarget.value;
    const onlyWhiteSpace = !searchInput || !searchInput.match(/[\S]/);
    this.setState({ searchInput });

    if (searchInput.match(/[^a-zA-Z0-9]/))
      return this.setState({ persons: [] });
    if (onlyWhiteSpace) return this.setState({ persons: [] });

    getUser(searchInput.trim()).then(data => {
      try {
        const substring = data.data.s1;
        const bankPerson = [];
        const identify = [];
        const persons = [];

        const addSubtring =
          substring.length > 0
            ? substring.map(item => bankPerson.push(item))
            : null;

        for (let i = 0; i < bankPerson.length; i++) {
          const find = identify.indexOf(bankPerson[i].id);
          if (find < 0) {
            identify.push(bankPerson[i].id);
            persons.push(bankPerson[i]);
          }
        }

        this.setState({ persons });
      } catch (error) {
        // CHANGE WITH TOASTIFT
        // console.log(error);
        // console.log("User invalid");
        throw new Error("data not found");
      }
    });
  };

  handleShowInput = () => {
    const showInput = !this.state.showInput;
    const onClickInput = !this.state.onClickInput;
    this.setState({ showInput, onClickInput, searchInput: "", persons: [] });
  };

  render() {
    const { user } = this.props;
    // console.log("this.state.persons", this.state.persons);
    // console.log("this.state.persons.onMouseLeave", this.state.onMouseLeave);

    return (
      <nav
        className="navbar navbar-expand-md inline-block navbar-dark bg-dark fixed-top p-0"
        style={{ minWidth: "274px" }}
      >
        {this.state.onClickInput && (
          <div className="backdrop" onClick={this.onClickBackdrop}></div>
        )}
        <div style={{ zIndex: "1" }} className="container pr-3 pl-3">
          {/* Hidden only on xs */}
          <Link
            onClick={this.onClick}
            className="navbar-brand d-none d-sm-block"
            to={{
              pathname: `/news`,
              state: "news"
            }}
          >
            EXPOSE
          </Link>
          {/* Visible only on xs */}
          {this.props.user && (
            <button
              type="button"
              className="btn p-0 m-0 d-flex align-items-center pr-2 pl-0 pb-1 pt-1 d-sm-none"
              style={{ outline: "none", boxShadow: "none" }}
              onClick={this.handleShowInput}
            >
              <i
                className="material-icons-round"
                style={{
                  fontSize: "30px",
                  color: "rgba(255, 255, 255, 0.5)"
                  // cursor: "pointer"
                }}
              >
                search
              </i>
            </button>
          )}
          {this.props.user && this.state.showInput && (
            <form className="form-inline mx-auto d-sm-none">
              <div className="dropdown show">
                <input
                  className="form-control form-control-sm dropdown-toggle"
                  style={{ width: "150px" }}
                  type="text"
                  data-toggle="dropdown"
                  autoComplete="off"
                  value={this.state.searchInput}
                  onChange={this.onChange}
                  onMouseDown={this.onClickInput}
                  onKeyDown={this.onKeyDown}
                />

                <SearchTypehead
                  persons={this.state.persons}
                  onClick={this.onClick}
                />
              </div>
            </form>
          )}
          {!this.state.showInput && (
            <Link
              onClick={this.onClick}
              className="navbar-brand d-sm-none mx-auto"
              to={{
                pathname: `/news`,
                state: "news"
              }}
            >
              EXPOSE
            </Link>
          )}
          {this.props.user && (
            <form className="form-inline mr-auto d-none d-sm-block">
              <div className="dropdown show">
                <input
                  className="form-control form-control-sm mr-2 dropdown-toggle"
                  type="text"
                  data-toggle="dropdown"
                  autoComplete="off"
                  value={this.state.searchInput}
                  onChange={this.onChange}
                  onMouseDown={this.onClickInput}
                  onKeyDown={this.onKeyDown}
                />

                <SearchTypehead
                  persons={this.state.persons}
                  onClick={this.onClick}
                />
              </div>
            </form>
          )}

          <button
            className="navbar-toggler border-0 pr-0"
            type="button"
            data-toggle="collapse"
            style={{ outline: "none" }}
            data-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav ml-auto">
              {user && (
                <React.Fragment>
                  <NavLink
                    onClick={this.onClick}
                    className="nav-link nav-item pt-1 pb-1"
                    to={{
                      pathname: `/news`,
                      state: "news"
                    }}
                  >
                    <div className="d-flex flex-column bd-highlight align-items-center">
                      <i
                        className="material-icons-round"
                        style={{ fontSize: "24px" }}
                      >
                        home
                      </i>
                      <small style={{ transform: "translateY(0)" }}>Home</small>
                    </div>
                  </NavLink>
                  <NavLink
                    onClick={this.onClick}
                    className="nav-link nav-item pt-1 pb-1"
                    to="/about"
                  >
                    <div className="d-flex flex-column bd-highlight align-items-center">
                      <i
                        className="material-icons"
                        style={{ fontSize: "24px" }}
                      >
                        info
                      </i>
                      <small style={{ transform: "translateY(0)" }}>
                        About
                      </small>
                    </div>
                  </NavLink>
                  <NavLink
                    onClick={this.onClick}
                    className="nav-link nav-item pt-1 pb-1"
                    to={{
                      pathname: `/profile/${user.user.username}`,
                      state: user.user.username
                    }}
                  >
                    <div className="d-flex flex-column bd-highlight align-items-center">
                      <i
                        className="material-icons"
                        style={{ fontSize: "24px" }}
                      >
                        account_circle
                      </i>
                      <small style={{ transform: "translateY(0)" }}>Me</small>
                    </div>
                  </NavLink>
                  <NavLink
                    onClick={this.onClick}
                    className="nav-link nav-item pt-1 pb-1"
                    to="/logout"
                  >
                    <div className="d-flex flex-column bd-highlight align-items-center">
                      <i
                        className="material-icons"
                        style={{ fontSize: "24px" }}
                      >
                        exit_to_app
                      </i>
                      <small style={{ transform: "translateY(0)" }}>
                        Logout
                      </small>
                    </div>
                  </NavLink>
                </React.Fragment>
              )}
              {!user && (
                <React.Fragment>
                  <NavLink className="nav-link nav-item ml-0" to="/login">
                    Login
                  </NavLink>
                  <NavLink className="nav-link nav-item" to="/register">
                    Register
                  </NavLink>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default withRouter(NavBar);
