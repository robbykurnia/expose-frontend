import React from "react";
import { Link } from "react-router-dom";

const ProfileNotFound = ({ username, login }) => {
  return (
    <React.Fragment>
      {!login && (
        <React.Fragment>
          <h4>An exact match for {username} could not be found.</h4>
          <p>
            The Expose profile you're looking for isn't public or doesn't exist.
            To search and filter 500 million Expose members,{" "}
            <Link to="/login">
              <strong>log in or join Expose today.</strong>
            </Link>
          </p>
        </React.Fragment>
      )}
      {login && (
        <React.Fragment>
          <h4>An exact match for {username} not available.</h4>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ProfileNotFound;
