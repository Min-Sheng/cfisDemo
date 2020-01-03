import React from 'react';
import axios from 'axios';
import {Progress} from 'reactstrap';
import ImageUploader from 'react-images-upload';
import Camera, { IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
// import gakki from './gakki.jpg';
import profile_template from './profile_template.jpeg';

class ProfileFeeder extends React.Component  {
  constructor(props) {
    super(props);
     this.state = { 
      selectedFile: null,
      isLive: false
      // picture: profile_template, 
                  };
    //  this.onDrop = this.onDrop.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.getUploadComponent = this.getUploadComponent.bind(this);
    this.getLiveStreamComponent = this.getLiveStreamComponent.bind(this);
  }
  
  onChangeHandler=event=>{
    if(this.checkMimeType(event)){ 
    // if return true allow to setState
      this.setState({
        selectedFile: event.target.files[0],
        loaded: 0,
      })
    }
    // // console.log(event.target.files[0]);
    // this.setState({
    //   selectedFile: event.target.files[0],
    //   loaded: 0,
    // })
  }

  onClickHandler = () => {
    if(this.state.selectedFile !== null){
      const data = new FormData();
      data.append('file', this.state.selectedFile);
      // axios.post("http://localhost:8000/upload", data, { 
      axios.post("/upload", data, { 
        // receive two    parameter endpoint url ,form data
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
          })
        }
      }).then(res => { // then print response status
        console.log(res.statusText)
        this.props.setUploadedToCompare(this.state.selectedFile.name);
      })
    }
    
  }
  handleSwitchChange = () => {
    this.setState(prevState => ({
      isLive: !prevState.isLive
    }));
  }
  checkMimeType=(event)=>{
    //getting file object
    let files = event.target.files 
    //define message container
    let err = ''
    // list allow mime type
   const types = ['image/png', 'image/jpeg', 'image/gif', 'image/i=jpg']
    // loop access array
    for(var x = 0; x<files.length; x++) {
     // compare file type find doesn't matach
         if (types.every(type => files[x].type !== type)) {
         // create error message and assign to container   
         err += files[x].type+' is not a supported format\n';
       }
     };
  
   if (err !== '') { // if message not same old that mean has error 
        event.target.value = null // discard selected file
        console.log(err)
         return false; 
    }
   return true;
  
  }
  // onDrop(pictures, file) {
  //     console.log(pictures.keys())
  //     this.setState({
  //         picture: file,
  //     });
  //     console.log(typeof(pictures));
  // }
  getUploadComponent = () =>{
    var picture = this.state.selectedFile == null ? profile_template : URL.createObjectURL(this.state.selectedFile);

    return <div>
      <img src={picture} className="upload-preview" alt="logo" />
      <form className="mt-3">
        <div className="form-group">
          <input type="file" name="file" className="btn" onChange={this.onChangeHandler}/>
          <Progress max="100" color="success" value={this.state.loaded} className="mt-3">{Math.round(this.state.loaded,2) }%</Progress>
          <button type="button" className="btn btn-success mt-3" onClick={this.onClickHandler}>Upload</button>
          
        </div>
      </form>
    </div>
  }
  getLiveStreamComponent = () =>{
    return <div>
      <Camera
      onTakePhoto = { (dataUri) => { this.handleTakePhoto(dataUri); } }
      imageType = {IMAGE_TYPES.JPG}
      />
    </div>
  };
  handleTakePhoto (dataUri) {
    // Do stuff with the photo...
    console.log('takePhoto');
    console.log(dataUri);
    let profileFile = dataURItoBlob(dataUri);
    let filename = "livedemo_" + getFormattedTime() + '.'+profileFile.type.split('/')[1];
    let formdata = new FormData();
    formdata.append('file',profileFile,filename);
    axios.post("/upload", formdata, { 
      // receive two    parameter endpoint url ,form data
      onUploadProgress: ProgressEvent => {
        this.setState({
          loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
        })
      }
    }).then(res => { // then print response status
      console.log(res.statusText)
      this.props.setUploadedToCompare(filename);
    })
    // this.setState({
    //   takenPhoto: dataUri.data,
    //   takenPhotoFileName:  ".png"
    // })
    
  }
  render(){
    var profileGate = this.state.isLive ? this.getLiveStreamComponent() : this.getUploadComponent();
    // console.log(picture);
    return (
      <div>
          <div className='custom-control custom-switch'>
            <input
              type='checkbox'
              className='custom-control-input'
              id='customSwitches'
              onChange={this.handleSwitchChange}
              readOnly
            />
            <label className='custom-control-label' htmlFor='customSwitches'>
              LiveStream
            </label>
          </div>
          {profileGate}
          
          {/* <ImageUploader
                withIcon={false}
                buttonText='Choose one image and upload it.'
                onChange={this.onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                singleImage={true}
          /> */}
          {/* <form class="mt-3">
            <div class="form-group">
              <input type="file" class="form-control-file" id="exampleFormControlFile1"/>
            </div>
          </form>
          <button type="button" class="btn btn-primary">Upload</button> */}
      </div>
    );
  }
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
export default ProfileFeeder;