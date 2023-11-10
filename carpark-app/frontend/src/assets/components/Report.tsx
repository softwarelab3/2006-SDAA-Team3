import React, { useState } from "react";
import Button from "./Button";
import Alert from "./Alert";

//import Reports from "./Report";

const Report: React.FC = () => {
  const [details, setDetails] = useState("");
  const [problem, setProblem] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get("username");

  const handleSubmitReport = async (e: any) => {
    e.preventDefault();
    console.log(details, problem);
    const url = "http://localhost:3000/Report";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ details, problem }),
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        if (response.status === "report has been created") {
          // Handle success, e.g., show a success message
          console.log("Report submitted successfully!");
          setAlertVisible(false);
          setAlertMessage("Report submitted successfully!");
          setSuccess(true);
          // Clear the input fields by setting them back to their initial values
          setDetails("");
          setProblem("");
        } else {
          // Handle errors, e.g., show an error message
          console.error("Report submission failed.");
        }
      })
      .catch((error) => {
        // Handle network or other errors
        console.error("Network error:", error);
      });

    if (!details.trim() || !problem.trim()) {
      setSuccess(false);
      setAlertMessage("Please Input Your Details/Problem.");
      setAlertVisible(true);
      return;
    }
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };
  const onCloseSuccess = () => {
    setSuccess(false);
  };

  return (
    <>
      {alertVisible && <Alert onClose={handleCloseAlert}>{alertMessage}</Alert>}
      {success && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          {alertMessage}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onCloseSuccess}
          ></button>
        </div>
      )}
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="card text-center"
          style={{ width: "40rem", height: "350px", marginTop: "-100px" }}
        >
          <div className="card-body">
            <h5 className="card-title">Report Fault</h5>
            <form autoComplete="off" onSubmit={handleSubmitReport}>
              <div className="mb-4 text-start">
                <label htmlFor="details" className="form-label">
                  SwiftPark Details
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="details"
                  placeholder="Enter SwiftPark Details"
                  onChange={(e) => setDetails(e.target.value)}
                  value={details}
                  style={{ marginBottom: "10px" }}
                  //list="carparkSuggestions"
                />
                <label htmlFor="problem" className="form-label">
                  Problem Faced
                </label>
                <textarea
                  //type="text"
                  className="form-control"
                  id="problem"
                  placeholder="Enter Problem Faced"
                  onChange={(e) => setProblem(e.target.value)}
                  value={problem}
                  style={{ height: "120px" }}
                  //list="carparkSuggestions"
                />
              </div>
              <div className="text-center">
                <Button color="primary" style={{ margin: "10px 0" }}>
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
