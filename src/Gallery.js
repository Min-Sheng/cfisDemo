import React from 'react';
import axios from 'axios';
import './Gallery.css';
import './Hover.css'

class GalleryItem extends React.Component {
  constructor(props) {
      super(props)
      this.onClickHandler = this.onClickHandler.bind(this);
  }

  onClickHandler = (filename) => {
    this.props.chooseByFileName(filename);
  }
  render() {
    if (!this.props.fileFromDB) this.props.item.active = false;
    return (
      <div className={"card hovereffect col-lg-3 col-md-3 col-6 "+ (this.props.item.active ? "chosen": "")}>
              <img className="img-fluid img-thumbnail" 
                  src={"/database/" + this.props.item.filename} alt="img not found"/>
              <div className="overlay">
                <h4>{this.props.item.filename}</h4>
                <button type="button" className="btn info mt-3" 
                        onClick={()=>this.onClickHandler(this.props.item.filename)}>
                {this.props.item.active ? "Unchoose": "Choose"}
                </button>
              </div>
      </div>
    )
  }
}
class Gallery extends React.Component  {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = { 
      gallery : [],
    };
    this.chooseByFileName = this.chooseByFileName.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    // axios.get('http://localhost:8000/image_list', {})
    axios.get('/image_list', {})
    .then(response => {
      // console.log(response);
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
    .finally(function () {
      // always executed
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  chooseByFileName = (filename) =>{
    const gallery = this.state.gallery;
    for(let i = 0; i < gallery.length; i++){
      if (filename === gallery[i].filename){
        gallery[i].active = !gallery[i].active;
        if (gallery[i].active){
          this.props.setSelectedFile("/database/" + filename, true);
          this.props.setCroppedFile(null);
          this.props.setLoaded(0);
          this.props.setResult(null);
          this.props.setInferenceFlag(false);
        }else{
          this.props.setSelectedFile(null, false);
          this.props.setCroppedFile(null);
          this.props.setLoaded(0);
          this.props.setResult(null);
          this.props.setInferenceFlag(false);
        }
      }else{
        gallery[i].active = false;
      }
    }
    this.setState({
      gallery : gallery
    });
  }
  render(){
    const items = this.state.gallery.map((item) => <GalleryItem key={item.filename} item={item} chooseByFileName={this.chooseByFileName} fileFromDB={this.props.fileFromDB}/>);
    return (
      <div>
        <div className="row text-center text-lg-left mt-3">
          {items}
        </div>
      </div>
    );
  }
}
  

export default Gallery;