import React from 'react';
import bsCustomFileInput from 'bs-custom-file-input'
import profile_template from './microscope.svg';

class ProfileFeeder extends React.Component  {
  constructor(props) {
    super(props);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.getUploadComponent = this.getUploadComponent.bind(this);
  }

  componentDidMount() {
    bsCustomFileInput.init()
  }

  onChangeHandler = (event) => {
    if(this.checkMimeType(event)){ 
    // console.log(event.target.files[0]);
      this.props.setLoaded(0);
      this.props.setSelectedFile(event.target.files[0], false);
      this.props.setCroppedFile(null);
      this.props.setResult(null);
      this.props.setInferenceFlag(false);
    }
    // // console.log(event.target.files[0]);
    // this.setState({
    //   selectedFile: event.target.files[0],
    //   loaded: 0,
    // })
  }

  checkMimeType = (event) => {
    //getting file object
    const files = event.target.files;
    if (files.length === 0) return false;
    //define message container
    let err = '';
    // list allow mime type
    const types = ['image/png', 'image/jpeg', 'image/gif', 'image/i=jpg'];
    // loop access array
    for(let x = 0; x<files.length; x++) {
     // compare file type find doesn't matach
         if (types.every(type => files[x].type !== type)) {
         // create error message and assign to container   
         err += files[x].type+' is not a supported format\n';
       }
     };
  
   if (err !== '') { // if message not same old that mean has error 
      event.target.value = null; // discard selected file
      console.log(err);
      alert(err);
      return false; 
    }
   return true;
  
  }

  getUploadComponent = (picture) => {
    return <div>
      <img src={picture} className="upload-preview" alt="logo"/>
        {/*<input type="file" name="file" className="btn" onChange={this.onChangeHandler} onClick={event => (event.target.value = null)} />*/}
        <div className="input-group mt-4">
          <div className="custom-file">
            <input id="inputGroupFile01" type="file" className="custom-file-input" onChange={this.onChangeHandler} />
            <label className="custom-file-label" htmlFor="inputGroupFile01">Choose file</label>
          </div>
        </div>
      </div>
  }

  render(){

    let picture = profile_template;
    if (!this.props.fileFromDB && this.props.displayPicture !== null) {
      picture = this.props.displayPicture;
    }
    else{
      picture = profile_template;
    }
    const profileGate = this.getUploadComponent(picture);
    // console.log(picture);
    return (
      <div>
          {profileGate}
      </div>
    );
  }
}

export default ProfileFeeder;
