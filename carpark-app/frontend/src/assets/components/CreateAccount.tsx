// CreateAccount.js

import React, { useEffect, useState } from "react";
import Button from "./Button";
import Alert from "./Alert";

const CreateAccount = () => {
  // State for handling alerts (similar to the login page)
  const [alertVisible, setAlertVisible] = React.useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  // userName, password, email, confirmPassword
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // submit login function
  const loginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userName, password, email, confirmPassword);
    const url = "http://localhost:3000/CreateAccount";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, userName, password, confirmPassword }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status === "some fields are empty") {
          setAlertMessage("Please fill in all the fields.");
          setAlertVisible(true);
        }

        if (data.status === "email has been used") {
          setAlertMessage("Email has already been used.");
          setAlertVisible(true);
        }
        if (data.status === "invalid username") {
          setAlertMessage("Invalid username.");
          setAlertVisible(true);
        }
        if (data.status === "weak password") {
          setAlertMessage("Password is too weak.");
          setAlertVisible(true);
        }
        if (data.status === "passwords do not match") {
          setAlertMessage("Passwords do not match.");
          setAlertVisible(true);
        }

        if (data.status === "account has been created") {
          setAlertVisible(false);
          setTimeout(() => {
            alert("Account has been created successfully");
            window.location.href = "./Login";
          }, 10);
        }
      });
  };
  useEffect(() => {
    // Automatically close the alert after 3 seconds when account is successfully created
    // if (alertVisible) {
    //   const timeout = setTimeout(() => {
    //     setAlertVisible(false);
    //   }, 50);
    //   return () => {
    //     clearTimeout(timeout);
    // };
    // }
  }, [alertVisible]);

  return (
    <>
      {alertVisible && (
        <Alert onClose={() => setAlertVisible(false)}>{alertMessage}</Alert>
      )}
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="card text-center"
          style={{ width: "25rem", marginTop: "-2rem" }}
        >
          <div className="card-body">
            <h5 className="card-title">Create an Account</h5>
            <form onSubmit={loginSubmit} autoComplete="off">
              <div className="mb-4 text-start">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email address"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4 text-start">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Choose a username"
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
                  placeholder="Enter a password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-4 text-start">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="card-footer text-center">
                <Button color="primary" onClick={() => null}>
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAccount;
