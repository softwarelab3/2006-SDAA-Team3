// ForgetPassword.tsx

import React, { useState, useEffect } from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import Alert from "./Alert";

const ForgetPasswordLogin = () => {
  // State for handling alerts
  const [alertVisible, setAlertVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showCancelButton, setShowCancelButton] = useState(false);

  // State for form inputs
  const [email, setEmail] = useState("");

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email);
    const url = "http://localhost:3000/ForgetPasswordLogin";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
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
        if (data.status === "account don't exist") {
          setAlertMessage(
            "Account Not Found. Please Verify Your Email Address."
          );
          setAlertVisible(true);
        }
        if (data.status === "email sent") {
          setSuccess(true);
          setShowCancelButton(true);
          // Automatically close the alert after 3 seconds (adjust the time as needed)
          setTimeout(() => {
            setAlertVisible(false);
          }, 50);
        }
      });
  };

  useEffect(() => {
    // This effect will run when alertVisible or showCancelButton changes
    // You can add logic here to handle when to hide the alert and cancel button
  }, [alertVisible, showCancelButton]);

  return (
    <>
      {alertVisible && (
        <Alert onClose={() => setAlertVisible(false)}>{alertMessage}</Alert>
      )}
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card text-center" style={{ width: "30rem" }}>
          <div className="card-body">
            <h5 className="card-title mb-3">Reset Password</h5>
            <p className="card-text mb-3">
              To ensure it's you, we'll need to verify your email address.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent form submission for this example
                handleResetPassword(e);
              }}
            >
              <div className="mb-3 text-start">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="card-footer text-end">
                {success && (
                  <div
                    className="alert alert-success alert-dismissible text-center"
                    role="alert"
                    style={{ padding: "10px" }}
                  >
                    <p style={{ fontSize: "14px", margin: "0" }}>
                      A verification email has been sent to your address.
                    </p>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  {!success && (
                    <Button color="primary" style={{ marginRight: "15px" }}>
                      Submit
                    </Button>
                  )}
                </div>
                {showCancelButton && (
                  <div className="mb-3">
                    <Link to="/">
                      <Button color="secondary" onClick={() => null}>
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPasswordLogin;
