// ResetPassword.tsx

import React, { useState, useEffect } from "react";
import Button from "./Button";
import { Link, useLocation } from "react-router-dom";
import Alert from "./Alert";

const ResetPassword = () => {
  // State for handling alerts
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCancelButton, setShowCancelButton] = useState(false);

  // State for form inputs
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const handleResetPassword = (e: React.FormEvent<HTMLFormElement>) => {
    const url = "http://localhost:3000/ResetPassword";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password, confirmPassword }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status === "weak password") {
          setAlertMessage("Password is too weak.");
          setAlertVisible(true);
        }
        if (data.status === "passwords do not match") {
          setAlertMessage("Passwords do not match.");
          setAlertVisible(true);
        }
        if (data.status === "password have been changed") {
          setSuccess(true);
          setShowCancelButton(true);
          setTimeout(() => {
            setAlertVisible(false);
          }, 50);
        }
      });
  };

  useEffect(() => {
    // This effect will run when alertVisible or showCancelButton changes
    // You can add logic here to handle when to hide the alert and cancel button
  }, [success, alertVisible, showCancelButton]);

  return (
    <>
      {alertVisible && (
        <Alert onClose={() => setAlertVisible(false)}>{alertMessage}</Alert>
      )}
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card text-center" style={{ width: "30rem" }}>
          <div className="card-body">
            <h5 className="card-title mb-3">Reset Password</h5>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent form submission for this example
                handleResetPassword(e);
              }}
            >
              <div className="mb-3 text-start">
                <label htmlFor="password" className="form-label">
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-3 text-start">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                      Your password has been reset successfully.
                    </p>
                  </div>
                )}
                {!success && (
                  <Button color="primary" style={{ marginRight: "15px" }}>
                    Reset Password
                  </Button>
                )}
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

export default ResetPassword;
