import React from 'react';
//import logo from './logo.svg';
import NavBar from './NavBar';
import Gallery from './Gallery';
import ProfileFeeder from './ProfileFeeder';
import Annotator from './Annotator';
import Result from './myResult';
import './App.css';
import './ProfileFeeder.css'
import './Annotator.css'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedFile: null,
      displayPicture: null,
      fileFromDB: false,
      loaded: 0,
      croppedFiles: [],
      uploadedFilename: null,
      resultPic: null,
      inferenceFlag: false
    };
    this.setSelectedFile = this.setSelectedFile.bind(this);
    this.setCroppedFile = this.setCroppedFile.bind(this);
    this.setLoaded = this.setLoaded.bind(this);
    this.deleteCroppedFile = this.deleteCroppedFile.bind(this);
    this.setUploadedFilename = this.setUploadedFilename.bind(this);
    this.setResult = this.setResult.bind(this);
    this.setInferenceFlag = this.setInferenceFlag.bind(this);
  }
  setLoaded = (loaded) => {
    this.setState({
      loaded: loaded,
    });
  }
  setSelectedFile = (file, fromDB) => {
    if (!this.state.fileFromDB && this.state.displayPicture !== null){
      URL.revokeObjectURL(this.state.displayPicture);
    } 
    if (!fromDB && file !== null){
      this.setState({
        selectedFile : file,
        displayPicture: URL.createObjectURL(file),
        fileFromDB: fromDB,
      });
    }
    else{
      this.setState({
        selectedFile : file,
        displayPicture: file,
        fileFromDB: fromDB,
      });
    }
  }
  setCroppedFile = (file) => {
    const max_size = 25;
    if (file === null) {
      this.setState({
        croppedFiles:  [],
      });
      this.setLoaded(0);
      this.setResult(null);
      this.setInferenceFlag(false);
    }
    else if (this.state.croppedFiles.length < max_size){
      let isDuplicate = false;
      const croppedFiles = this.state.croppedFiles.filter(item => {
        if (item === file) {
          isDuplicate = true;
          alert("Please crop a new RoI");
          return item;
        } 
        return (item !== file);});
        if (isDuplicate) {
          this.setState({
            croppedFiles: croppedFiles,
          });
        }else{
          this.setState({
            croppedFiles: croppedFiles.concat([file]),
        });
        this.setLoaded(0);
        this.setResult(null);
        this.setInferenceFlag(false);
      }
    } else {
      alert("Reach max size "+ max_size + ".");
    }
  }
  deleteCroppedFile = (file) => {
    if (this.state.croppedFiles.length){
        this.setState({
          croppedFiles: this.state.croppedFiles.filter(item => item !== file)
        });
    }
  }
  setUploadedFilename = (name) => {
    this.setState({
      uploadedFilename : name
    });
  }
  setResult = (file) => {
    this.setState({
      resultPic: file,
    });
  }

  setInferenceFlag = (inferenceFlag) => {
    this.setState({
      inferenceFlag: inferenceFlag
    });
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <div className="container">
            <NavBar />
          </div>
        </header>
        <div className="App-body">
          <div className="container">
            <div className="row" >
              <div className="col-sm-3">
                <h3 className="font-weight-light text-center text-lg-left mt-4 mb-0">Upload</h3>
                <div className="help-tip">
                  <p style={{width:'200px'}}>Upload your image.</p>
                </div>
                <hr className="mt-1 mb-1"/>
                <ProfileFeeder setLoaded = {this.setLoaded} 
                                setSelectedFile = {this.setSelectedFile} 
                                setCroppedFile ={this.setCroppedFile} 
                                displayPicture = {this.state.displayPicture} 
                                fileFromDB = {this.state.fileFromDB}
                                setResult = {this.setResult} 
                                setInferenceFlag = {this.setInferenceFlag} />
              </div>
              <div className="col-sm-1">
                <h4 className="font-weight-light text-center text-lg-left mt-4 mb-0">or</h4>
              </div>
              <div className="col-sm-8">
                  <h3 className="font-weight-light text-center text-lg-left mt-4 mb-0">Select</h3>
                  <div className="help-tip">
                    <p style={{width:'320px'}}>Select the image from the database.</p>
                  </div>
                  <hr className="mt-1 mb-1"/>
                  <Gallery setLoaded = {this.setLoaded} 
                            setSelectedFile={this.setSelectedFile} 
                            setCroppedFile ={this.setCroppedFile} 
                            fileFromDB = {this.state.fileFromDB}
                            setResult = {this.setResult} 
                            setInferenceFlag = {this.setInferenceFlag} />
              </div>
            </div>
            <div className="row" >
              <div className="col-sm-12">
                  <h3 className="font-weight-light text-center text-lg-left mt-4 mb-0">Annotate a few</h3>
                  <div className="help-tip">
                    <p style={{width:'320px'}}>Crop a few Region of Interests (RoIs). <br/> Click twice to toggle drag mode.</p>
                  </div>
                  <hr className="mt-1 mb-1"/>
                    <Annotator setLoaded ={this.setLoaded}
                                setCroppedFile={this.setCroppedFile} 
                                deleteCroppedFile = {this.deleteCroppedFile}
                                selectedFile = {this.state.selectedFile}
                                setUploadedFilename = {this.setUploadedFilename}
                                loaded = {this.state.loaded}
                                displayPicture = {this.state.displayPicture} 
                                fileFromDB = {this.state.fileFromDB} 
                                croppedFiles={this.state.croppedFiles} 
                                setResult = {this.setResult} 
                                setInferenceFlag = {this.setInferenceFlag} />
                <div className="row" >
                  <div className="col-sm-12">
                      <h3 className="font-weight-light text-center text-lg-left mt-4 mb-0">Result</h3>
                      <div className="help-tip">
                        <p style={{width:'380px'}}>The few-shot instance segmentation result.</p>
                      </div>
                      <hr className="mt-1 mb-1"/>
                        <Result loaded = {this.state.loaded}
                                uploadedFilename = {this.state.uploadedFilename}
                                fileFromDB = {this.state.fileFromDB}
                                croppedFiles = {this.state.croppedFiles} 
                                displayPicture = {this.state.displayPicture} 
                                resultPic = {this.state.resultPic}
                                inferenceFlag = {this.state.inferenceFlag}
                                setResult = {this.setResult} 
                                setInferenceFlag = {this.setInferenceFlag}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
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
          </a>
        </header>
        */}
      </div>
    );
  }
}

export default App;
