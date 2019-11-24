import React from 'react';
import axios from 'axios';
import {Progress} from 'reactstrap';
import ImageUploader from 'react-images-upload';
// import gakki from './gakki.jpg';
import profile_template from './profile_template.jpeg';

class ProfileFeeder extends React.Component  {
  constructor(props) {
    super(props);
     this.state = { 
      selectedFile: null,
      // picture: profile_template, 
                  };
    //  this.onDrop = this.onDrop.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
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
  
  render(){
    var picture = this.state.selectedFile == null ? profile_template : URL.createObjectURL(this.state.selectedFile);
    // console.log(picture);
    return (
      <div>
          <img src={picture} className="upload-preview" alt="logo" />
          <form className="mt-3">
            <div className="form-group">
              <input type="file" name="file" className="btn" onChange={this.onChangeHandler}/>
              <Progress max="100" color="success" value={this.state.loaded} className="mt-3">{Math.round(this.state.loaded,2) }%</Progress>
              <button type="button" className="btn btn-success mt-3" onClick={this.onClickHandler}>Upload</button>
            </div>
          </form>
          
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

export default ProfileFeeder;