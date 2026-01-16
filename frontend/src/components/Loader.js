import React from "react";

export default function Loader({ size = "medium", text = "Loading..." }) {
  const sizeClasses = {
    small: "spinner-small",
    medium: "spinner-medium",
    large: "spinner-large"
  };

  return (
    <div className="enhanced-loader">
      <div className="loader-container">
        <div className={`loader-spinner ${sizeClasses[size]}`}>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-center"></div>
        </div>
        {text && <div className="loader-text">{text}</div>}
      </div>
    </div>
  );
}


