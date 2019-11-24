import React from 'react';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#">xCos Demo</a>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                    <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">
                    R07944011 Yu-Sheng Lin CMLAB
                    </a>
                </li>
            </ul>
        </div>
        
    </nav>
  );
}

export default NavBar;
