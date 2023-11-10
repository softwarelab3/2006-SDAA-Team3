import React, { useState, useEffect } from "react";
import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";
import { GoogleMapsWrapper } from "./GoogleMapsWrapper";

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState({
    lat: 0,
    lng: 0,
  });
  const [destinationPosition, setDestinationPosition] = useState({
    lat: 1.3483,
    lng: 103.6831,
  });
  const [positionC, setPositionC] = useState({
    lat: 1.3386592120903409,
    lng: 103.6968178714572,
  });

  let directionsService: {
    route: (
      arg0: {
        origin: any;
        destination: any;
        travelMode: google.maps.TravelMode;
      },
      arg1: (result: any, status: any) => void
    ) => void;
  };
  const [directions, setDirections] = useState(null);

  const changeDirection = (origin: any, destination: any) => {
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          //changing the state of directions to the result of direction service
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };
  const onMapLoad = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const currentGPSPosition = { lat: latitude, lng: longitude };
        setCurrentPosition(currentGPSPosition);
        directionsService = new google.maps.DirectionsService();
        changeDirection(currentGPSPosition, destinationPosition);
      });
    } else {
      console.error("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cplatitude = urlParams.get("latitude");
    const cplongitude = urlParams.get("longitude");
    const destLat = urlParams.get("destLat");
    const destLon = urlParams.get("destLon");

    const parsedData = {
      latitude: cplatitude ? parseFloat(cplatitude) : 0,
      longitude: cplongitude ? parseFloat(cplongitude) : 0,
      destLat: destLat ? parseFloat(destLat) : 0,
      destLon: destLon ? parseFloat(destLon) : 0,
    };

    setDestinationPosition({
      lat: parsedData.latitude,
      lng: parsedData.longitude,
    });
    setPositionC({ lat: parsedData.destLat, lng: parsedData.destLon });
  }, []);

  return (
    <GoogleMapsWrapper>
      <GoogleMap
        center={currentPosition}
        zoom={14}
        onLoad={() => onMapLoad()}
        mapContainerStyle={{
          margin: "0 auto", // Center horizontally
          height: "90vh",
          width: "90%",
          position: "relative",
        }}
      >
        {directions !== null && <DirectionsRenderer directions={directions} />}
        <Marker position={positionC} />
      </GoogleMap>
    </GoogleMapsWrapper>
  );
};

export default Map;
