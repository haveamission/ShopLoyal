import React, { Component } from 'react';
import axios from 'axios';
import API from './API';
import { connect } from "react-redux";
import searchSave from '../actions/search'
import {bindActionCreators} from 'redux'
const format = require('string-format')

class Search extends Component {
  constructor(props){
    super(props);
    this.state = {
      text: '',
    typing: false,
    typingTimeout: 0
    }
    this.handleChange = this.handleChange.bind(this);
  }

  searchForText = (text) => {
this.props.searchSave(text);
  }

  handleChange (event) {
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