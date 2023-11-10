import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";

const FavouriteCarPark = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  const [isLoading, setIsLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get("username");

  useEffect(() => {
    const url = "http://localhost:3000/LoadFavouriteCarPark";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setIsLoading(false); // Data has been loaded
        if (responseData.status === "No Favourite") {
          console.log("No favourite");
          // If there's no favorite data, we don't update the state.
        } else if (responseData.FavouriteList) {
          console.log(responseData.FavouriteList);
          setData(responseData.FavouriteList);
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false); // Loading failed
      });
  }, [userName]);

  // Calculate the index of the last item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calculate the index of the first item on the current page
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Get the current items to display on the page
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (address: String) => {
    const action = "Delete";
    const url = "http://localhost:3000/FavouriteCarPark";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, address, action }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "item deleted") {
          // Filter out the deleted item from the data
          const updatedData = data.filter((item) => item !== address);
          setData(updatedData); // Update the state
        }
      })
      .catch((error) => console.error(error));
  };

  const handleNavigate = (address: string) => {
    const action = "Navigate";
    const url = "http://localhost:3000/FavouriteCarPark";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, address, action }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          const latitude = data.coordinates.latitude;
          const longitude = data.coordinates.longitude;
          const mapURL = `/Map?address=${encodeURIComponent(
            address
          )}&latitude=${latitude}&longitude=${longitude}&username=${userName}`;
          window.location.href = mapURL;
        }
      });
  };

  const renderData = () => {
    if (isLoading) {
      return <p>Loading...</p>;
    } else if (data.length === 0) {
      return (
        <p className="text-center">
          Add your favorite car parks and get started!
        </p>
      );
    } else {
      return (
        <table className="table">
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr>
              <th className="text-center">Car Park</th>
              <th className="text-center">Delete</th>
              <th className="text-center">Navigate</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{item}</td>
                <td className="text-center">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleDelete(item)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                    }}
                  >
                    <img
                      src="../../delete.png"
                      alt="Delete"
                      style={{ width: "20px" }}
                    />
                  </button>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-primary"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                    }}
                    onClick={() => handleNavigate(item)}
                  >
                    <img
                      src="../../compass.png"
                      alt="Navigate"
                      style={{ width: "20px" }}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="col-md-8">
        <h3 className="text-center mx-auto mb-4">Favourite Car park</h3>
        <div className="card" style={{ minHeight: "320px" }}>
          <div className="card-body">{renderData()}</div>
        </div>

        <div className="text-center mt-4">
          <nav>
            <ul className="pagination justify-content-end">
              {Array.from({
                length: Math.ceil(data.length / itemsPerPage),
              }).map((item, index) => (
                <li
                  key={index}
                  className={`page-item ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(index + 1)}
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

export default FavouriteCarPark;
