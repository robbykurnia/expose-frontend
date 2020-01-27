import React from "react";

const ProfileJumbotron = ({ idThisProfile, usernameThisProfile }) => {
  const stylePhoto = {
    borderRadius: "50%",
    border: "2px solid grey",
    width: "150px",
    height: "150px",
    position: "absolute",
    transform: "translateY(80px)"
  };
  const styleCard = {
    minHeight: "284px"
    // minWidth: "928px"
  };
  return (
    <div className="card mb-3" style={styleCard}>
      <img
        className="mb-5 rounded-top"
        src={`https://i.picsum.photos/id/1${idThisProfile}/1000/200.jpg`}
        alt=""
      />
      <img
        style={stylePhoto}
        className="ml-4"
        src={`https://i.picsum.photos/id/${idThisProfile}/160/160.jpg`}
        alt="Profile"
      />
      <h4 className="ml-4">
        {`\n\n\n\n`}
        {usernameThisProfile}
      </h4>
    </div>
  );
};

export default ProfileJumbotron;
