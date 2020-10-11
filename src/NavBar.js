import React from 'react';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div><span>Class-agnostic Few-shot Instance Segmentation of Pathological Images</span></div>
      <button className="navbar-toggler ml-0" data-toggle="collapse" data-target="#navbarSupportedContent">
        <span className="navbar-toggler-icon"></span>
      </button>
    </nav>
  );
}

/*function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div><span>Class-agnostic Few-shot Instance Segmentation of Pathological Images</span></div>
      <button className="navbar-toggler ml-0" data-toggle="collapse" data-target="#navbarSupportedContent">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="https://github.com/Min-Sheng/cfisDemo" target="_blank" rel="noopener noreferrer">
                Github
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://github.com/Min-Sheng" target="_blank" rel="noopener noreferrer">
                Min-Sheng Wu
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="http://cmlab.csie.ntu.edu.tw/new_cml_website/index.php" target="_blank" rel="noopener noreferrer">
                CMLAB
              </a>
            </li>
        </ul>
      </div>
    </nav>
  );
}
*/
export default NavBar;
