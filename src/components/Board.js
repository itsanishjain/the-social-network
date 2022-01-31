import React from "react";

export default function Board({ id, user, imageUrl }) {
  const info = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
  const postImage = {
    width: "100%",
    height: "auto",
    
  };

  return (
    <div className="card">
      <div className="info">
        <img style={postImage} src={imageUrl} alt="post" />
        <p>
          <span className="nav-li-a">by-{user}</span>
        </p>
      </div>
    </div>
  );
}
