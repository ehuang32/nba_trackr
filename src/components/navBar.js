import React from 'react';
import { Link } from 'react-router-dom'
import '../css/navBar.css';

// Header navigation bar.

class NavBar extends React.Component {
    render() {
        return (
            <div className='navBar'>
                <ul className='navBarList'>
                    <li className='navBar-item'>
                        <Link to="/" className="navLink"> Homepage </Link>
                    </li>
                    <li className='navBar-item'>
                        <Link to="/bet" className="navLink"> BetTrackr </Link>
                    </li>
                    <li className='navBar-item'>
                        <Link to="/games" className="navLink"> Games </Link>
                    </li>

                </ul>
            </div>
        )
    }
}


export default NavBar;