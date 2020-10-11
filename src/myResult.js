import React from 'react';
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import { PulseLoader } from 'react-spinners';
import ScrollIntoViewIfNeeded from 'react-scroll-into-view-if-needed';

class Result extends React.Component {
  constructor(props) {
      super(props);
      this.exeInference = this.exeInference.bind(this);
      this.onClickHandler = this.onClickHandler.bind(this);
      this.getInferenceComponent = this.getInferenceComponent.bind(this);
      this.getResultComponent = this.getResultComponent.bind(this);
  }

  exeInference = () => {
    const payload = {
      uploadedFilename: this.props.uploadedFilename,
      fileFromDB: this.props.fileFromDB,
      croppedFileNumber: this.props.croppedFiles.length,
    }
    axios.post('/inference', payload)
    .then(res => {
        console.log(res);
        const resultBase64Img = res.data;
        this.props.setResult(resultBase64Img);
        this.props.setInferenceFlag(false);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally();
    /*axios.get('/inference', {
      params: {
        uploadedFilename: this.props.uploadedFilename,
        fileFromDB: this.props.fileFromDB,
        croppedFileNumber: this.props.croppedFiles.length,
      }
    })
    .then(res => {
      console.log(res);
      const resultBase64Img = res.data;
      this.props.setResult(resultBase64Img);
    })*/
  }

  onClickHandler = () => {
    if (this.props.resultPic){ 
      confirmAlert({
        title: 'Confirm to inference again',
        message: 'The result exists. Do you want to inference again?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              this.props.setResult(null);
              this.props.setInferenceFlag(true);
              this.exeInference();
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
    } else {
      this.props.setInferenceFlag(true);
      this.exeInference();
    }
  }

  getInferenceComponent = () => {
    if (this.props.loaded === 100 || this.props.resultPic) {
      return (
        <div>
          <ScrollIntoViewIfNeeded options={{block: "start", behavior: 'smooth'}}>
            <div className="row">
              <div className="col">
                <button type="button" className="btn btn-warning mt-3 mb-3" onClick={this.onClickHandler}>Inference</button>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className='sweet-loading mb-3'>
                  <PulseLoader
                    size={25}
                    color={'#9B9B9B'} 
                    loading={this.props.inferenceFlag} 
                  />
                </div>
              </div>
            </div>
          </ScrollIntoViewIfNeeded>
        </div>
      )
    }
  }

  getResultComponent = () => {
    if (this.props.resultPic){
      return(
      <div>
        <ScrollIntoViewIfNeeded  options={{block: "start", behavior: 'smooth'}}>
          <div className="row mb-3">
            <div className="col">
              <h4 className="font-weight-light text-center">Input</h4>
              {/* <img src={"/results/" + item.picPath} className="App-logo img-fluid" alt="no result yet" /> */}
              <img src={this.props.displayPicture} className="img-fluid" alt="no input" />
            </div>
            <div className="col">
              <h4 className="font-weight-light text-center">Prediction</h4>
              {/* <img src={"/results/" + item.picPath} className="App-logo img-fluid" alt="no result yet" /> */}
              <img src={`data:image/png;base64,${this.props.resultPic}`} className="img-fluid" alt="no result yet" />
            </div>
          </div>
        </ScrollIntoViewIfNeeded>
      </div>)
    }
  }

  render(){
    const profileGate = this.getInferenceComponent();
    const picture = this.getResultComponent();

    return (
      <div>
        {profileGate}
        {picture}
      </div>
    );
  }
}

export default Result;