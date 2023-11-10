import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./assets/components/Login";
import CreateAccount from "./assets/components/CreateAccount";
import NavigationBar from "./assets/components/NavigationBar";
import Home from "./assets/components/Home";
import Help from "./assets/components/Help";
import About from "./assets/components/About";
import SearchCarPark from "./assets/components/SearchCarPark";
import Admin from "./assets/components/Admin";
import ResetPassword from "./assets/components/ResetPassword";
import ForgetPasswordLogin from "./assets/components/ForgetPasswordLogin";
import Map from "./assets/components/Map";
import ChooseCarPark from "./assets/components/ChooseCarPark";
import FavouriteCarPark from "./assets/components/FavouriteCarPark";
import Report from "./assets/components/Report";
function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const userName = urlParams.get("username");
  const homeLinks = [
    { to: "/Login", label: "Login" },
    { to: "/About", label: "About" },
  ];

  const otherLinks = [
    // Define navigation for other routes here
    { to: "/Login", label: "Logout" },
    { to: `/SearchCarPark?username=${userName}`, label: "Back" },
  ];
  const searchCarParkLinks = [
    { to: `/FavouriteCarpark?username=${userName}`, label: "Favourite" },
    { to: `/Report?username=${userName}`, label: "Report" },
    { to: "/Login", label: "Logout" },
  ];

  const resetLink = [{ to: "/", label: "Home" }];
  const mainApp = [
    { to: `/SearchCarPark?username=${userName}`, label: "Back" },
  ];
  const logoSrc = "../Logo.png";

  return (
    <>
      <Routes>
        {/* Homepage nav bar*/}
        <Route
          path="/"
          element={
            <>
              <NavigationBar logo={logoSrc} links={homeLinks} />
              <Home />
            </>
          }
        />
        <Route
          path="/Help"
          element={
            <>
              <NavigationBar logo={logoSrc} links={homeLinks} />
              <Help />
            </>
          }
        />
        <Route
          path="/Login"
          element={
            <>
              <NavigationBar logo={logoSrc} links={homeLinks} />
              <Login />
            </>
          }
        />
        <Route
          path="/About"
          element={
            <>
              <NavigationBar logo={logoSrc} links={homeLinks} />
              <About />
            </>
          }
        />
        <Route
          path="/CreateAccount"
          element={
            <>
              <NavigationBar logo={logoSrc} links={homeLinks} />
              <CreateAccount />
            </>
          }
        />
        <Route
          path="/ForgetPasswordLogin"
          element={
            <>
              <NavigationBar logo={logoSrc} links={homeLinks} />
              <ForgetPasswordLogin />
            </>
          }
        />

        {/* other nav bar */}
        <Route
          path="/SearchCarpark"
          element={
            <>
              <NavigationBar logo={logoSrc} links={searchCarParkLinks} />
              <SearchCarPark />
            </>
          }
        />

        <Route
          path="/FavouriteCarpark"
          element={
            <>
              <NavigationBar logo={logoSrc} links={otherLinks} />
              <FavouriteCarPark />
            </>
          }
        />

        <Route
          path="/Admin"
          element={
            <>
              <NavigationBar logo={logoSrc} links={otherLinks} />
              <Admin />
            </>
          }
        />

        <Route
          path="/ResetPassword"
          element={
            <>
              <NavigationBar logo={logoSrc} links={resetLink} />
              <div className="container-fluid h-100 d-flex justify-content-center align-items-center"></div>
              <ResetPassword />
            </>
          }
        />

        <Route
          path="/Map"
          element={
            <>
              <NavigationBar logo={logoSrc} links={mainApp} />
              <Map />
            </>
          }
        />

        <Route
          path="/ChooseCarPark"
          element={
            <>
              <NavigationBar logo={logoSrc} links={mainApp} />
              <ChooseCarPark />
            </>
          }
        />

        <Route
          path="/Report"
          element={
            <>
              <NavigationBar logo={logoSrc} links={otherLinks} />
              <Report />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
