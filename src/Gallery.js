import React from 'react';
import axios from 'axios';
import './Gallery.css';
import './Hover.css'
import gakki3 from './gakki3.jpg';

class GalleryItem extends React.Component {
  constructor(props) {
      super(props)
      this.onClickHandler = this.onClickHandler.bind(this);
  }

  onClickHandler = (filename)=>{
    this.props.chooseByFileName(filename);
  }
  render() {
      return (
        <div class={"card hovereffect col-lg-2 col-md-2 col-6 "+ (this.props.item.active ? "chosen": "")}>
          {/* <a href="#" class="d-block mt-2 mb-2 h-100"> */}
                {/* <img class="img-fluid img-thumbnail" 
                    src={"http://localhost:8000/database/" + this.props.item.filename} alt="img not found"/> */}
                <img class="img-fluid img-thumbnail" 
                    src={"/database/" + this.props.item.filename} alt="img not found"/>
                <div class="overlay">
                  <h4>{this.props.item.filename}</h4>
                  {/* <a class="info" href="#">Choose</a> */}
                  <button type="button" className="btn info mt-3" 
                          onClick={()=>this.onClickHandler(this.props.item.filename)}>
                  {this.props.item.active ? "Unchoose": "Choose"}
                  </button>
                </div>
          {/* </a> */}
        </div>
          // <div 
          //     className={this.state.active ? 'your_className': null} 
          //     onClick={this.toggleClass} 
          // >
          //     <p>{this.props.text}</p>
          // </div>
      )
}
}
class Gallery extends React.Component  {
  constructor(props) {
    super(props);
    this.state = { 
      gallery : [],
    };
    // axios.get('http://localhost:8000/image_list', {})
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
    .finally(function () {
      // always executed
    });  
    this.chooseByFileName = this.chooseByFileName.bind(this);
    // this.onClickHandler = this.onClickHandler.bind(this);
  }
  chooseByFileName = (filename) =>{
    let gallery = this.state.gallery
    for(let i = 0; i < gallery.length; i++){
      if (filename === gallery[i].filename){
        gallery[i].active = !gallery[i].active;
        if (gallery[i].active){
          this.props.setGalleryToCompare(filename);
        }else{
          this.props.setGalleryToCompare("");
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
    const items = this.state.gallery.map((item) => <GalleryItem item={item} chooseByFileName={this.chooseByFileName}/>);
    return (
      <div>
        <div class="row text-center text-lg-left">

          {items}
        </div>
      </div>
    );
  }
}
  

export default Gallery;