import React, { useEffect, useState } from "react";

// Define a TypeScript type for the data you expect
interface ProcessedData {
  destinationLocation: [number, number];
  results: {
    [key: string]: {
      carpark_code: string;
      distance: string;
      duration: string;
      lots_available: string;
      total_lots: string;
      latitude: number; // Add latitude property
      longitude: number; // Add longitude property
    };
  };
}

const ChooseCarPark = () => {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [userName, setUsername] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jsonData = urlParams.get("data");
    const urlUsername = urlParams.get("username");

    if (jsonData) {
      try {
        // Decode the URL-encoded JSON data
        const decodedData = decodeURIComponent(jsonData);
        const parsedData = JSON.parse(decodedData) as ProcessedData;
        setData(parsedData);
      } catch (error) {
        console.error("Error parsing JSON data:", error);
      }
    }
    if (urlUsername) {
      setUsername(urlUsername);
    }
  }, []);

  const handleNavigate = (
    address: string,
    latitude: number,
    longitude: number
  ) => {
    // Construct the URL with latitude, longitude, and destination location
    if (data) {
      const destinationLocation = data.destinationLocation;
      const mapURL = `/Map?address=${encodeURIComponent(
        address
      )}&latitude=${latitude}&longitude=${longitude}&destLat=${
        destinationLocation[0]
      }&destLon=${destinationLocation[1]}&username=${userName}`;

      // Navigate to the /Map page with the constructed URL
      window.location.href = mapURL;
    }
  };

  const handleAddToFav = (
    address: string,
    latitude: number,
    longitude: number
  ) => {
    const url = "http://localhost:3000/AddToFavourite";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, address, latitude, longitude }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status === "added to favourite") {
          setAlertVisible(false);
          setAlertMessage("Car Park added To Favourite");
          setSuccess(true);
        } else if (data.status === "already in favourite") {
          setSuccess(false);
          setAlertMessage("Car Park already in Favourite");
          setAlertVisible(true);
        }
      });
  };
  const onCloseSuccess = () => {
    setSuccess(false);
  };
  const onCloseAlert = () => {
    setAlertVisible(false);
  };

  return (
    <>
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

      {/* Display red alert if status is "already in favourite" */}
      {alertVisible && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {alertMessage}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onCloseAlert}
          ></button>
        </div>
      )}
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "70vh" }}
      >
        {data ? (
          <div className="col-lg-8">
            <h3 className="text-center mb-4">Choose a Car Park</h3>
            <div className="card">
              <div className="card-body text-center">
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <table className="table">
                    <colgroup>
                      <col style={{ width: "35%" }} />
                      <col style={{ width: "15%" }} />
                      <col style={{ width: "15%" }} />
                      <col style={{ width: "20%" }} />
                      <col style={{ width: "15%" }} />
                      <col style={{ width: "10%" }} />
                      <col style={{ width: "15%" }} />
                    </colgroup>

                    <thead>
                      <tr>
                        <th className="text-center">Address</th>
                        <th className="text-center">Distance</th>
                        <th className="text-center">Duration</th>
                        <th className="text-center">Lots Vacancies</th>
                        <th className="text-center">Favourite</th>
                        <th className="text-center">Navigate</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(data.results).map(([key, value]) => (
                        <tr key={key}>
                          <td className="text-center">{key}</td>
                          <td className="text-center">{value.distance}</td>
                          <td className="text-center">{value.duration}</td>
                          <td className="text-center">
                            {value.lots_available} / {value.total_lots}
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                              }}
                              onClick={() =>
                                handleAddToFav(
                                  key,
                                  value.latitude,
                                  value.longitude
                                )
                              }
                            >
                              <img
                                src="../../favorite.png"
                                alt="add to favourite"
                              />
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() =>
                                handleNavigate(
                                  key,
                                  value.latitude,
                                  value.longitude
                                )
                              }
                              style={{
                                background: "none",
                                border: "none",
                                padding: 0,
                              }}
                            >
                              <img src="../../compass.png" alt="Navigate" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </>
  );
};

export default ChooseCarPark;
