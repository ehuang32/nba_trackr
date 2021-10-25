import React from "react";
import { Link } from "react-router-dom";
import "../css/navBar.css";
import _ from "lodash";

const menuItems = [
  {
    id: 1,
    route: "",
    text: "Homepage",
  },
  {
    id: 2,
    route: "bet",
    text: "BetTrackr",
  },
  {
    id: 3,
    route: "games",
    text: "Games",
  },
];

// Header navigation bar.

class NavBar extends React.Component {
  render() {
    return (
      <div className="navBar">
        <ul className="navBarList">
          {_.map(menuItems, ({ menuItems: id, route, text }) => (
            <li key={id} className="navBar-item">
              <Link to={`/${route}`} className="navLink">
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default NavBar;
