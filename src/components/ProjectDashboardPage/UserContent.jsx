import React from "react";
import "./UserContent.css";

const UserContent = ({ id, name, isViewAll, onViewAll }) => {
  return (
    <div
      className={`user-content ${isViewAll ? "view-all" : ""}`}
      onClick={isViewAll ? onViewAll : undefined}
    >
      <div className="user-icon">{isViewAll ? "ALL" : name.charAt(0)}</div>
      <h2>{name}</h2>
    </div>
  );
};

export default UserContent;
