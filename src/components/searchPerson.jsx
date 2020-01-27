import React, { Component } from "react";
import { getUser } from "./../services/service";
import { Link } from "react-router-dom";
import ProfileNotFound from "./common/profileNotFound";

class SearchPerson extends Component {
  constructor(props) {
    super(props);
    this.state = { persons: [] };
  }

  componentDidMount() {
    console.log("call componentDidMount");
    this.handleGetUser();
  }

  handleGetUser = () => {
    getUser(this.props.match.params.username).then(data => {
      try {
        const substring = data.data.s1;
        const regex = data.data.s2;
        const bankPerson = [];
        const identify = [];
        const persons = [];

        const addSubtring =
          substring.length > 0
            ? substring.map(item => bankPerson.push(item))
            : null;
        const addRegex =
          regex.length > 0 ? regex.map(item => bankPerson.push(item)) : null;

        for (let i = 0; i < bankPerson.length; i++) {
          const find = identify.indexOf(bankPerson[i].id);
          if (find < 0) {
            identify.push(bankPerson[i].id);
            persons.push(bankPerson[i]);
          }
        }

        this.setState({ persons });
      } catch (error) {
        // console.log(error);
        // console.log("User invalid");
        throw new Error("data not found");
      }
    });
  };

  render() {
    const { persons } = this.state;

    return (
      <React.Fragment>
        {!this.props.user && (
          <ProfileNotFound
            username={this.props.match.params.username}
            login={this.props.user}
          />
        )}
        {this.props.user && (
          <React.Fragment>
            <table className="w-100">
              <thead>
                <tr>
                  <td>
                    <h1>Search {this.props.match.params.username}</h1>
                  </td>
                </tr>
              </thead>
              {persons.length > 0 &&
                persons.map(person => (
                  <tbody key={person.id} className="card-body card mb-3 p-2">
                    <tr className="d-flex align-items-center">
                      <td className="d-flex flex-column border-0 mr-2">
                        <Link
                          to={`/profile/${person.username}`}
                          className="post-photo"
                        >
                          <img
                            className="post-photo"
                            src={`https://i.picsum.photos/id/${person.id}/300/300.jpg`}
                            alt="Profile"
                          />
                        </Link>
                      </td>
                      <td className="d-flex flex-column border-0">
                        <Link to={`/profile/${person.username}`}>
                          {person.username}
                        </Link>
                        <small>{person.email}</small>
                      </td>
                      <td className="ml-auto">
                        <Link to={`/profile/${person.username}`}>
                          <button type="button" className="btn btn-primary">
                            View
                          </button>
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                ))}
            </table>
            {persons.length === 0 && (
              <h2>{this.props.match.params.username} not found.</h2>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default SearchPerson;
