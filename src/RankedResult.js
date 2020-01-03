import React from 'react';
import axios from 'axios';
import './RankedResult.css'


class RankedResult extends React.Component {
  constructor(props) {
      super(props);
      this.state = { 
        progressTextList : [],
        comparisonResultList:[],
        uploadedFilename: "",
        comparisonResult:"",
        gallery: []
      }; 
      this.onClickHandler = this.onClickHandler.bind(this);
      this.regitsterProgress = this.regitsterProgress.bind(this);
      this.registerResultPic = this.registerResultPic.bind(this);
      this.cleanProgress = this.cleanProgress.bind(this);
      this.execComparison = this.execComparison.bind(this);
      this.getGalleryFilenames = this.getGalleryFilenames.bind(this);
      this.sortComparisonResult = this.sortComparisonResult.bind(this);
      this.cleanResults = this.cleanResults.bind(this);
      this.getGalleryFilenames();
  }
  getGalleryFilenames = () =>{
    axios.get('/image_list', {})
      .then(response => {
        console.log(response);
        this.setState({
          gallery : response.data.map((name)=>({
              filename: name,
              active: false
          })),
        });
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() =>{
        // always executed
        
      });  
  }
  cleanResults = ()=>{
    this.setState({
      comparisonResultList:[]
    })
  }
  onClickHandler = (uploadedFilename)=>{
    
    if (uploadedFilename.length > 0){
      this.cleanResults()
      // this.regitsterProgress("Initializing comparison process")
      // console.log(this.state.gallery.sort().slice(4, 11))
      // this.state.gallery.sort().slice(4, 11).map((item) => {
      this.state.gallery.sort().slice(4, 16).map((item) => {
        this.execComparison(uploadedFilename, item.filename);
      })
      
    }
  }
  registerResultPic = (comparisonResultPic, comparisonScore) =>{
    console.log("In registerResultPic")
    this.setState({
      comparisonResultList:[
        ...this.state.comparisonResultList,
        {
          pic: comparisonResultPic,
          score: comparisonScore
        }
      ]
    })
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
      let comparisonResultPic = response.data[0];
      let comparisonScore =  response.data[1];
      this.registerResultPic(comparisonResultPic, comparisonScore);
      return comparisonScore
      
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally((score) => {
      // always executed
      this.cleanProgress();
      this.regitsterProgress((score> 0.24 ? "The same person!" : "Not similar!") + 
      ", xCos score: " + score)
      this.sortComparisonResult();
    }); 
  }
  sortComparisonResult = ()=>{
    this.setState({
      comparisonResultList:[
        ...this.state.comparisonResultList.sort((a, b) => parseFloat(b.score) - parseFloat(a.score))
      ]
    })
    console.log("After sorting")
    console.log(this.state.comparisonResultList)
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
  getResultComponent = (item) => {
    return(
    <div>
      <img src={"/results/" + item.pic} className="App-logo img-fluid" alt="no result yet" />
      <p>{(item.score> 0.24 ? "The same person!" : "Not similar!") + ", xCos score: " + item.score}</p>
    </div>)
  }
  render(){
    var compareBtn = <button type="button" className="btn btn-primary mt-3" 
                        onClick={()=>this.onClickHandler(this.props.uploadedFilename)}>
                      Compare
                      </button>
    var displayedUploadedFilename = this.props.uploadedFilename.length > 0 ? this.props.uploadedFilename : "----";
    var displayedGalleryFilenames = this.state.gallery.length > 0 ? this.state.gallery.map(item=>item.filename) : "----";
    var progressText = this.state.progressTextList.map((text)=><p>{">>> " + text + "..."}</p>);
  var pictures = this.state.comparisonResultList.map((item)=>this.getResultComponent(item));
    return (
      <div>
        <div className="row">
          <div className="col">
            {/* <img src={"http://localhost:8000/results/" + this.state.comparisonResult} className="App-logo img-fluid" alt="no result yet" /> */}
            {pictures}

          </div>
         
        </div>
        <div className="row mt-3">
          <div className="col">
            <p className="h6">Comparing {displayedUploadedFilename} and {displayedGalleryFilenames}</p>
            {compareBtn}
            {progressText}
          </div>
        </div>
          
          
          
          
      </div>
    );
  }
}

export default RankedResult;