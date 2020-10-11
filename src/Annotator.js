import React from 'react';
import axios from 'axios';
import {Progress} from 'reactstrap';
import ScrollIntoViewIfNeeded from 'react-scroll-into-view-if-needed';
import Cropper from 'react-cropper';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'cropperjs/dist/cropper.css';
import './Hover.css'

class CroppedItem extends React.Component {
  render() {
    return (
      <div className="card hoverdelete">
        <ScrollIntoViewIfNeeded options={{block: "nearest", behavior: 'smooth'}}>
          <img className="img-fluid img-thumbnail cropped-img" 
            src={this.props.item} alt="cropped img"/>
          <div className="overlay">
            <button type="button" className="btn info mt-3"
              onClick={()=>{
                this.props.deleteCroppedFile(this.props.item);
                this.props.setLoaded(0);
                this.props.setResult(null);
                this.props.setInferenceFlag(false);
              }}>
              Delete
            </button>
          </div>
        </ScrollIntoViewIfNeeded>
      </div>
    )
  }
}

class Annotator extends React.Component  {
  constructor(props) {
    super(props);
    this.cropImage = this.cropImage.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.getAnnotateComponent = this.getAnnotateComponent.bind(this);
  }

  cropImage = () => {
    if (typeof this.cropper.getCroppedCanvas() === 'undefined' || this.cropper.getCroppedCanvas() === null) {
      return;
    }
    this.props.setCroppedFile(this.cropper.getCroppedCanvas().toDataURL());
  }

  clearAll = () => {
    this.props.setCroppedFile(null);
    this.props.setLoaded(0);
    this.props.setResult(null);
    this.props.setInferenceFlag(false);
  }

  onClickHandler = () => {
    if (this.props.selectedFile !== null){
      let isFail = false;
      if (this.props.croppedFiles.length <= 0) {
        alert("Please crop at least 1 patch.");
        return;
      }
      confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to submit?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              const data = new FormData();
              let filename, extension;
              let timeStamp = getFormattedTime();
              if (!this.props.fileFromDB) {
                [filename, extension] = this.props.selectedFile.name.split('.')
                                        .reduce((acc, val, i, arr) => (i === arr.length - 1) 
                                            ? [acc[0].slice(1), val] 
                                            : [[acc[0], val].join('.')], []);
                data.append('file', this.props.selectedFile, filename + '_' + timeStamp + '.' + extension);
              } else {
                [filename, extension] = this.props.selectedFile.split('/').pop().split('.')
                                        .reduce((acc, val, i, arr) => (i === arr.length - 1) 
                                            ? [acc[0].slice(1), val] 
                                            : [[acc[0], val].join('.')], []);
              }
              this.props.setUploadedFilename(filename + '_' + timeStamp + '.' + extension);
              let profileFile, queryFilename;
              for (let i = 0; i < this.props.croppedFiles.length; i++) {
                profileFile = dataURItoBlob(this.props.croppedFiles[i]);
                queryFilename = filename + '_' + timeStamp + '-q' + i + '.' + profileFile.type.split('/')[1];
                data.append('file', profileFile, queryFilename);
              }
              // axios.post("http://localhost:8000/upload", data, { 
              axios.post("/upload", data, { 
                // receive two parameter endpoint url ,form data
                onUploadProgress: ProgressEvent => {
                  this.props.setLoaded(ProgressEvent.loaded / ProgressEvent.total*100);
                }
              }).then(res => { // then print response status
                console.log(res);
              })
              .catch(function (error) {
                console.log(error);
                alert("Please upload the file smaller than 100M");
                isFail = true;
                return;
              })
              .finally(() =>{
                // always executed
                if (isFail)
                  this.props.setLoaded(0);
              });
            }
          },
          {
            label: 'No',
            onClick: () => {
              return;
            }
          }
        ]
      });
    }
  }

  getAnnotateComponent = (items) =>{
    if (this.props.displayPicture !== null) {
      return <div>
            <div className="row" >
              <div className="col-sm-6 mt-3">
                <ScrollIntoViewIfNeeded  options={{block: "center", behavior: 'smooth'}}>
                  <Cropper
                    viewMode={2}
                    style={{height: 460, width: '100%'}}
                    guides={false}
                    data={{
                        x: 50,
                        y: 50,
                        width: 75,
                        height: 75,
                        }}
                    modal = {false}
                    responsive = {true}
                    src={this.props.displayPicture}
                    ref={cropper => { this.cropper = cropper; }}
                    />
                </ScrollIntoViewIfNeeded>
                <div className="row" >
                  <div className="col-sm-4 mt-3">
                    <button type="button" className="btn btn-primary" onClick={this.cropImage}>Crop</button>
                  </div>
                  <div className="col-sm-4 mt-3">
                    <button type="button" className="btn btn-danger" onClick={this.clearAll}>Clear</button>
                  </div>
                  <div className="col-sm-4 mt-3">
                    <button type="button" className="btn btn-success" onClick={this.onClickHandler}>Submit</button>
                  </div>
                </div>
                <div className="row" >
                  <div className="col-sm-12">
                    <Progress max="100" color="success" value={this.props.loaded} className="mt-3">{Math.round(this.props.loaded,2)}%</Progress>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
              <div className="text-center text-lg-left mt-3">
                {items}
                {/*{this.props.croppedFiles[0] ? (
                    <img className="cropped-img mt-3" src={this.props.croppedFiles[0]} alt="cropped_img" />
                  ) : null}*/}
              </div>
            </div>
          </div>
      </div>
    }
  }
  render(){
    const items = this.props.croppedFiles.map((item) => 
        <CroppedItem key={item} item={item} deleteCroppedFile={this.props.deleteCroppedFile} 
          setLoaded={this.props.setLoaded} setResult={this.props.setResult} setInferenceFlag={this.props.setInferenceFlag}/>);
    const profileGate = this.getAnnotateComponent(items);
    return (
      <div>
        {profileGate}
      </div>
    );
  }
}

function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
  else
      byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {type:mimeString});
}

function getFormattedTime() {
  var today = new Date();
  var y = today.getFullYear();
  // JavaScript months are 0-based.
  var m = today.getMonth() + 1;
  var d = today.getDate();
  var h = today.getHours();
  var mi = today.getMinutes();
  var s = today.getSeconds();
  return y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
}

export default Annotator;
