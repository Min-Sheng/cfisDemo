import React from 'react';
import axios from 'axios';
import './Result.css'


class Result extends React.Component {
  constructor(props) {
      super(props);
      this.state = { 
        progressTextList : [],
        uploadedFilename: "",
        comparisonResult:""
      }; 
      this.onClickHandler = this.onClickHandler.bind(this);
      this.regitsterProgress = this.regitsterProgress.bind(this);
      this.cleanProgress = this.cleanProgress.bind(this);
      this.execComparison = this.execComparison.bind(this);
  }
  onClickHandler = (uploadedFilename, galleryFilename)=>{
    if (uploadedFilename.length > 0 && galleryFilename.length > 0){
      // this.cleanProgress()
      // this.regitsterProgress("Initializing comparison process")
      this.execComparison(uploadedFilename, galleryFilename);
    }
  }
  execComparison = (uploadedFilename, galleryFilename)=>{
    // axios.get('http://localhost:8000/comparison', {
    axios.get('/comparison', {
      params: {
      uploadedFilename: uploadedFilename,
      galleryFilename: galleryFilename
      }
    })
    .then(response => {
      console.log(response);
      this.setState({
        comparisonResult: response.data[0],
        comparisonScore: response.data[1]
      });
      this.cleanProgress();
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(() => {
      // always executed
      this.regitsterProgress((this.state.comparisonScore > 0.24 ? "The same person!" : "Not similar!") + 
      ", xCos score: " + this.state.comparisonScore)
    }); 
  }
  regitsterProgress = (text) =>{
    this.setState({
      progressTextList:[
        ...this.state.progressTextList,
        text 
      ]
    })
    console.log(">>>>>")
    console.log(this.state.progressTextList)
  }
  cleanProgress = () =>{
    // XXX This function didn't work properly...
    console.log(">>>>>. clean....")
    this.setState({
      progressTextList:[]
    });
    console.log(this.state.progressTextList)
  }
  render(){
    var compareBtn = <button type="button" className="btn btn-primary mt-3" 
                        onClick={()=>this.onClickHandler(this.props.uploadedFilename, 
                                                          this.props.galleryFilename)}>
                      Compare
                      </button>
    var displayedUploadedFilename = this.props.uploadedFilename.length > 0 ? this.props.uploadedFilename : "----";
    var displayedGalleryFilename = this.props.galleryFilename.length > 0 ? this.props.galleryFilename : "----";
    var progressText = this.state.progressTextList.map((text)=><p>{">>> " + text + "..."}</p>);
    return (
      <div>
        <div className="row">
          <div className="col">
            {/* <img src={"http://localhost:8000/results/" + this.state.comparisonResult} className="App-logo img-fluid" alt="no result yet" /> */}
            <img src={"/results/" + this.state.comparisonResult} className="App-logo img-fluid" alt="no result yet" />

          </div>
         
        </div>
        <div className="row mt-3">
          <div className="col">
            <p className="h6">Comparing {displayedUploadedFilename} and {displayedGalleryFilename}</p>
            {compareBtn}
            {progressText}
          </div>
        </div>
          
          
          
          
      </div>
    );
  }
}

export default Result;