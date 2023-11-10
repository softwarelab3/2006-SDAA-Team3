import React, { useState } from "react";
import Button from "./Button"; // Import your custom Button component
import Alert from "./Alert";
import { Link } from "react-router-dom";

const linkStyle = {
  textDecoration: "none", // Remove text decoration (underline)
};

const Form = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  // const [activeButton, setActiveButton] = useState("user");
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Function to toggle between "User" and "Admin" buttons
  // const toggleButtons = () => {
  //   setActiveButton((prevActiveButton) =>
  //     prevActiveButton === "user" ? "admin" : "user"
  //   );
  // };
  // submit login function
  const loginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userName, password);
    const url = "http://localhost:3000/Login";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status === "user login") {
          window.location.href = `./SearchCarpark?username=${userName}`;
        }
        if (data.status === "admin login") {
          window.location.href = "./Admin";
        }
        if (
          data.status === "error" &&
          data.error === "Invalid username or password"
        ) {
          setAlertVisible(true);
        }
      });
  };

  return (
    <>
      {alertVisible && (
        <Alert onClose={() => setAlertVisible(false)}>
          Login Unsuccessful. Please use the correct username and password.
        </Alert>
      )}
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="card text-center"
          style={{ width: "25rem", marginTop: "-4rem" }}
        >
          {/* <div className="card-header">
            <ul className="nav nav-pills justify-content-center">
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeButton === "user" ? "active" : ""
                  }`}
                  onClick={() => setActiveButton("user")}
                >
                  User
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${
                    activeButton === "admin" ? "active" : ""
                  }`}
                  onClick={() => setActiveButton("admin")}
                >
                  Admin
                </button>
              </li>
            </ul>
          </div> */}
          <div className="card-body">
            <h5 className="card-title">Login</h5>
            <form onSubmit={loginSubmit} autoComplete="off">
              <div className="mb-4 text-start">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Enter your username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mb-4 text-start">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                {/* Links for "Create an Account" and "Forgot Password" */}
                <div className="mt-3 text-start">
                  <Link to="/CreateAccount" style={linkStyle}>
                    Create an Account
                  </Link>
                  <br />
                  <Link to="/ForgetPasswordLogin" style={linkStyle}>
                    Forget Password?
                  </Link>
                </div>
              </div>
              {/* Include your custom login button here */}
              <div className="card-footer text-center">
                <Button color="primary">Login</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
