import React from 'react';
import logo from './logo.svg';

import NavBar from './NavBar';
import ProfileFeeder from './ProfileFeeder';
import Gallery from './Gallery';
import Result from './Result';
import RankedResult from './RankedResult';
import './App.css';
import './ProfileFeeder.css'


class App extends React.Component  {
  constructor(props) {
    super(props);
    this.state = { 
      galleryFilename : "",
      uploadedFilename: ""
    }; 
    this.setGalleryToCompare = this.setGalleryToCompare.bind(this);
    // this.onClickHandler = this.onClickHandler.bind(this);
  }
  setGalleryToCompare = (name) =>{
    this.setState({
      galleryFilename : name
    });
  }
  setUploadedToCompare = (name) =>{
    this.setState({
      uploadedFilename : name
    });
  }
  render(){
    return (
      <div className="App">
        <header className="App-header">
          <div className="container">
            <NavBar />
            <div className="row" >
              <div className="col-sm-2">
                <h3 class="font-weight-light text-center text-lg-left mt-4 mb-0">Upload</h3>
                <hr class="mt-1 mb-1"/>
                <ProfileFeeder setUploadedToCompare={this.setUploadedToCompare}/>
              </div>
              <div className="col-sm-10">
                {/* <div className="row"> */}
                  <h3 class="font-weight-light text-center text-lg-left mt-4 mb-0">Results</h3>
                  <hr class="mt-1 mb-1"/>
                  <RankedResult uploadedFilename={this.state.uploadedFilename}/>
                {/* </div> */}
                {/* <div className="row"> */}
                  <div className="col-sm-12">
                    <h3 class="font-weight-light text-center text-lg-left mt-4 mb-0">Gallery</h3>
                    <hr class="mt-1 mb-1"/>
                    <Gallery setGalleryToCompare={this.setGalleryToCompare}/>
                  </div>
                {/* </div> */}
              </div>
            </div>
            
          </div>
  
          {/* <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a> */}
        </header>
      </div>
    );
  }
  
}

export default App;
