import React, { useState } from "react";
import "../css/SearchCarpark.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import Alert from "./Alert";
import Loading from "./Loading";

const SearchCarPark = () => {
  const [filterType, setFilterType] = useState("default");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get("username");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setFilterType(event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedCheckboxes((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedCheckboxes((prevSelected) =>
        prevSelected.filter((item) => item !== value)
      );
    }
  };

  const handleSearchCarpark = async () => {
    setLoading(true);
    const searchBox = document.querySelector(
      ".custom-search-box"
    ) as HTMLInputElement;
    const location = searchBox ? searchBox.value : "";
    const selectedFilter = filterType;
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position: GeolocationPosition) => {
            resolve(position);
          },
          (error: GeolocationPositionError) => {
            reject(error);
          }
        );
      }
    );

    let latitude, longitude: number;
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(latitude, longitude);

    const requestData = {
      location: location,
      filter: selectedFilter,
      selectedCheckboxes: selectedCheckboxes,
      userCurrentPosition: { latitude, longitude },
    };

    console.log(requestData);

    console.log(requestData);

    const url = "http://127.0.0.1:5000/SearchCarPark";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestData }),
      credentials: "same-origin", // Add this line
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        console.log(data);
        if (data.status == "Not in Local") {
          setAlertMessage(
            "Current Position Not in Singapore, Navigation Not Supported."
          );
          setAlertVisible(true);
        } else if (data.status == "Destination Not in Local") {
          setAlertMessage(
            "Destination Location Not in Singapore, Navigation Not Supported."
          );
          setAlertVisible(true);
        } else if (data.status == "No results found") {
          setAlertMessage(
            "No Car Park matches Filter, Please adjust the Filter."
          );
          setAlertVisible(true);
        } else if (data.status == "No carparks nearby that matches condition") {
          setAlertMessage(
            "No Car Park matches Filter, Please adjust the Filter."
          );
          setAlertVisible(true);
        } else {
          window.location.href = `/ChooseCarPark?username=${userName}&data=${JSON.stringify(
            data
          )}`;
        }
      });
  };
  const handleSearchButtonClick = () => {
    // Call the handleSearchCarpark function when the button is clicked
    console.log("Button clicked"); // Check if this message appears in the console
    alert("Button has been clicked");
    handleSearchCarpark();
  };

  return (
    <>
      {loading ? (
        <Loading /> // Render the loading component when loading is true
      ) : (
        <>
          {alertVisible && (
            <Alert onClose={() => setAlertVisible(false)}>{alertMessage}</Alert>
          )}
          <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="container-fluid h-100 d-flex justify-content-center align-items-center">
              <div className="text-center" style={{ marginTop: "-100px" }}>
                <h2 style={{ marginBottom: "20px" }}>
                  Search The Nearest Car Park
                </h2>
                <div className="input-group mb-3">
                  <input
                    style={{ width: "500px" }}
                    type="text"
                    className="form-control custom-search-box"
                    placeholder="Enter Location"
                    aria-label="Enter Location"
                    aria-describedby="search-button"
                  />
                  <button
                    className="btn btn-secondary dropdown-toggle filter-button custom-bg"
                    type="button"
                    id="filter-dropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                  </button>
                  <ul
                    className="dropdown-menu scrollable-menu"
                    aria-labelledby="filter-dropdown"
                  >
                    <li>
                      <label className="dropdown-item">
                        <input
                          type="radio"
                          value="default"
                          checked={filterType === "default"}
                          onChange={handleFilterChange}
                        />
                        Use Default Filter
                      </label>
                    </li>
                    <li>
                      <label className="dropdown-item">
                        <input
                          type="radio"
                          value="custom"
                          checked={filterType === "custom"}
                          onChange={handleFilterChange}
                        />
                        Use Custom Filter
                      </label>
                    </li>
                    {filterType === "custom" && (
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                    )}
                    {filterType === "custom" && (
                      <li className="dropdown-header">Type of Car Parks</li>
                    )}
                    {filterType === "custom" && (
                      <li>
                        <label className="dropdown-item smaller-text">
                          <input
                            type="checkbox"
                            value="Multi-Storey Car Parks"
                            onChange={handleCheckboxChange}
                            checked={selectedCheckboxes.includes(
                              "Multi-Storey Car Parks"
                            )}
                          />{" "}
                          Multi-Storey Car Parks
                        </label>
                      </li>
                    )}
                    {filterType === "custom" && (
                      <li>
                        <label className="dropdown-item smaller-text">
                          <input
                            type="checkbox"
                            value="Basement Car Parks"
                            onChange={handleCheckboxChange}
                            checked={selectedCheckboxes.includes(
                              "Basement Car Parks"
                            )}
                          />{" "}
                          Basement Car Parks
                        </label>
                      </li>
                    )}
                    {filterType === "custom" && (
                      <li>
                        <label className="dropdown-item smaller-text">
                          <input
                            type="checkbox"
                            value="Surface Car Parks"
                            onChange={handleCheckboxChange}
                            checked={selectedCheckboxes.includes(
                              "Surface Car Parks"
                            )}
                          />{" "}
                          Surface Car Parks
                        </label>
                      </li>
                    )}
                    {filterType === "custom" && (
                      <li className="dropdown-header">
                        Type of Parking System
                      </li>
                    )}
                    {filterType === "custom" && (
                      <li>
                        <label className="dropdown-item smaller-text">
                          <input
                            type="checkbox"
                            value="Coupon Parking"
                            onChange={handleCheckboxChange}
                            checked={selectedCheckboxes.includes(
                              "Coupon Parking"
                            )}
                          />{" "}
                          Coupon Parking
                        </label>
                      </li>
                    )}
                    {filterType === "custom" && (
                      <li>
                        <label className="dropdown-item smaller-text">
                          <input
                            type="checkbox"
                            value="Electronic Parking System"
                            onChange={handleCheckboxChange}
                            checked={selectedCheckboxes.includes(
                              "Electronic Parking System"
                            )}
                          />{" "}
                          Electronic Parking System
                        </label>
                      </li>
                    )}
                    {filterType === "custom" && (
                      <li className="dropdown-header">
                        Night Parking Availability
                      </li>
                    )}
                    {filterType === "custom" && (
                      <li>
                        <label className="dropdown-item smaller-text">
                          <input
                            type="checkbox"
                            value="Night Parking"
                            onChange={handleCheckboxChange}
                            checked={selectedCheckboxes.includes(
                              "Night Parking"
                            )}
                          />{" "}
                          Night Parking
                        </label>
                      </li>
                    )}
                  </ul>
                  <button
                    className="btn btn-primary"
                    type="button"
                    id="search-button"
                    onClick={handleSearchButtonClick}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SearchCarPark;
