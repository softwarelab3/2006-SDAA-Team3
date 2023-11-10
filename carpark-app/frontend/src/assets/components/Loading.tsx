import React from "react";
import "../css/LoadingPage.css"; // Create a CSS file for LoadingPage styles

const LoadingPage = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingPage;
