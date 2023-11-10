import React from "react";
import "../../App.css";

const Home = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h1
          className="display-4 mb-4"
          style={{ color: "#333", fontSize: "2.5rem" }}
        >
          SwiftPark: Where Parking Meets Effortless Solutions
        </h1>
        <p
          className="lead mb-4"
          style={{
            marginTop: "20px",
            color: "#555",
          }}
        >
          Navigating Parking, Your Space, Effortlessly Solved
        </p>
      </div>
    </div>
  );
};

export default Home;
