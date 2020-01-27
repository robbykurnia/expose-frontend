import React from "react";
import { Link } from "react-router-dom";

const SearchTypehead = ({ persons, onClick }) => {
  return (
    <React.Fragment>
      {persons.length > 0 && (
        <div
          className="dropdown-menu show"
          aria-labelledby="dropdownMenuButton"
        >
          {persons.map(item => (
            <Link
              key={item.id}
              className="dropdown-item pr-2 pl-2"
              to={`/profile/${item.username}`}
              onClick={onClick}
              // onMouseLeave={onMouseLeave}
              // onMouseEnter={onMouseEnter}
            >
              <img
                className="comment-photo mr-2"
                src={`https://i.picsum.photos/id/${item.id}/300/300.jpg`}
                alt="Profile"
              />
              {item.username}
            </Link>
          ))}
        </div>
      )}
    </React.Fragment>
  );
};

export default SearchTypehead;
