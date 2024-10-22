import React from "react";

export const BackgroundNode = ({ data }) => {
  if (!data.src)
    return (
      <div
        style={{
          width: "600px",
          height: "400px",
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      ></div>
    );
  else
    return (
      <div>
        <img src={data.src} alt="배경" />
      </div>
    );
};
