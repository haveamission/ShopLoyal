import React, { Component } from 'react';
import axios from 'axios';
import API from './API';
import { connect } from "react-redux";
import searchSave from '../actions/search'
import {bindActionCreators} from 'redux'
const format = require('string-format')

class Search extends Component {

componentDidMount() {
  console.log("initial props");
  console.log(this.props);
}


  constructor(props){
    super(props);
    this.state = {
      text: '',
    typing: false,
    typingTimeout: 0
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    }
    this.showPosition = this.showPosition.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  configuration(data) {
    this.setState({data, isLoading: false});
}

  showPosition =(position) =>  {
    console.log("position");
    console.log(position);
    this.setState({position: position.coords});
    console.log(this.props);
    if(this.props.oidc) {
      let config = {
        headers: {
          Authorization: "Bearer " + this.props.oidc.user.access_token,
          //Origin: "App",
        }
      }
      console.log("top girl");
      console.log(API.localBaseUrlString + API.merchantAPI + "?lat=" + this.state.position.latitude + "&lng=" + this.state.position.longitude + "&radius=10.0&limit=30&search=" + this.state.search);
      axios.get(API.localBaseUrlString + API.merchantAPI + "?lat=" + this.state.position.latitude + "&lng=" + this.state.position.longitude + "&radius=10.0&limit=30&search=" + this.state.search, config).then(
        response => this.configuration(response.data)
      ).catch(function(error) {
        console.log(error);
      })
    
    }
  }

  searchForText = (text) => {
    console.log("user stopped typing");
console.log(text);
this.props.searchSave(text);
  }

  handleChange (event) {
    console.log('handle change called');
    this.setState({value: event.target.value});
    const self = this;

    if (self.state.typingTimeout) {
       clearTimeout(self.state.typingTimeout);
    }

    self.setState({
       text: event.target.value,
       typing: false,
       typingTimeout: setTimeout(function () {
           self.searchForText(self.state.text);
         }, 1000)
    });
  }


  render(){
    return(
      <span className="search-text">
      <i className="fas fa-search small"></i>
      <input className="" placeholder="Search" onChange={this.handleChange}></input>
      </span>
  )
}
}

const mapStateToProps = (state) => {
  console.log("map state to props");
  console.log(state);
  return {
    oidc: state.oidc,
    search: state.search,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ searchSave }, dispatch);
  //return { ...actions, dispatch };
}


export default connect(mapStateToProps, mapDispatchToProps)(Search)