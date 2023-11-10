// NavigationBar.tsx

import React from "react";
import { Link } from "react-router-dom";

interface LinkItem {
  to: string;
  label: string;
}

interface Props {
  logo: string;
  links: LinkItem[];
}

const NavigationBar: React.FC<Props> = ({ logo, links }) => {
  const linkStyle = {
    textDecoration: "none",
    marginRight: "20px",
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo/Brand (text) */}
        <Link to="/" style={linkStyle}>
          <img src={logo} alt="Logo" height="40"></img>
        </Link>

        {/* Navbar Links */}
        <ul className="navbar-nav ml-auto">
          {links.map((link, index) => (
            <li className="nav-item" key={index}>
              <Link to={link.to} style={linkStyle}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
