import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button"; // Import Button component
import Alert from "./Alert"; // Import Alert component
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const linkStyle = {
  textDecoration: "none",
};

interface FaultCase {
  id: number;
  details: string; // Add other properties here if needed
  problem: string;
}

const Admin: React.FC = () => {
  const [adminCurrentPage, setAdminCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [faultCases, setFaultCases] = useState<FaultCase[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const url = "http://localhost:3000/LoadReport";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "No Report") {
          console.log("No Report");
        } else if (data.ReportList) {
          console.log(data.ReportList);
          const updatedFaultCases = data.ReportList.map(
            (item: { problem: any; reportid: any; details: any }) => ({
              id: item.reportid,
              details: item.details,
              problem: item.problem,
            })
          );
          setFaultCases(updatedFaultCases);
        }
      })
      .catch((error) => {
        console.error("Error fetching cases:", error);
        setAlertVisible(true);
      });
  }, []);

  const openModal = (problem: string) => {
    setSelectedProblem(problem);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedProblem(null);
    setIsModalVisible(false);
  };

  const resolve = () => {
    if (selectedProblem) {
      const url = "http://localhost:3000/ResolveReport";
      const faultCaseToResolve = faultCases.find(
        (caseItem) => caseItem.problem === selectedProblem
      );

      if (faultCaseToResolve) {
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: faultCaseToResolve.id,
            details: faultCaseToResolve.details,
            problem: faultCaseToResolve.problem,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            if (data.status === "item resolved") {
              setFaultCases((prevFaultCases) => {
                return prevFaultCases.filter(
                  (caseItem) => caseItem !== faultCaseToResolve
                );
              });
              closeModal();
              // code to update page with the item deleted
            }
          });
      }
    }
  };

  const sortedFaultCases = faultCases.slice().sort((a, b) => a.id - b.id);
  const adminIndexOfLastItem = adminCurrentPage * itemsPerPage;
  const adminIndexOfFirstItem = adminIndexOfLastItem - itemsPerPage;
  const adminCurrentFaultCases = sortedFaultCases.slice(
    adminIndexOfFirstItem,
    adminIndexOfLastItem
  );

  const paginateAdmin = (pageNumber: React.SetStateAction<number>) => {
    setAdminCurrentPage(pageNumber);
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="col-md-8">
        <h3 className="text-center mx-auto mb-4 mt-4">Faults Reported</h3>
        {alertVisible && (
          <Alert onClose={() => setAlertVisible(false)}>
            Error fetching cases. Please try again later.
          </Alert>
        )}
        {faultCases.length === 0 ? ( // Check if faultCases is empty
          <p className="text-center">No faults reported at the moment.</p>
        ) : (
          <div className="card" style={{ minHeight: "320px" }}>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th className="text-center">Case Number</th>
                    <th className="text-center">Case Details</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminCurrentFaultCases.map((faultCase) => (
                    <tr key={faultCase.id}>
                      <td className="text-center">{faultCase.id}</td>
                      <td className="text-center">{faultCase.details}</td>
                      <td className="text-center">
                        <Button
                          color="primary"
                          className="admin-view-details-button"
                          onClick={() => openModal(faultCase.problem)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {isModalVisible && (
          <div
            className="modal fade show"
            style={{
              display: "block",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1040,
            }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Problem Details</h5>
                </div>
                <div className="modal-body">{selectedProblem}</div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsModalVisible(false);
                      setSelectedProblem(null);
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={resolve}
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-4">
          <nav>
            <ul className="pagination justify-content-end">
              {Array.from({
                length: Math.ceil(faultCases.length / itemsPerPage),
              }).map((_, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    adminCurrentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginateAdmin(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Admin;
