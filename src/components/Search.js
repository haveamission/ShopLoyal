import React, { Component } from 'react';
import axios from 'axios';
import API from './API';
import { connect } from "react-redux";
import searchSave from '../actions/search'
import {bindActionCreators} from 'redux'
import { push } from 'connected-react-router'
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
//this.setState({value: null});
this.props.dispatch(push("/map"));
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


  /*render(){
    return(
      <span className="search-text">
            {this.state.value ? (
        <i class="fas fa-times small"></i>
      ) : (
        <i className="fas fa-search small"></i>
      )}
      <input className="" placeholder="Search" onChange={this.handleChange}></input>
      </span>
  )
}*/

  render(){
    return(
      <span className="search-wrapper">
                  {this.state.value ? (
        <i className="fas fa-times large"></i>
      ) : (
        ""
      )}
<input ref={(ip) => this.myInp = ip} className="search-input" onChange={this.handleChange}></input>
{this.state.value ? (
        ""
      ) : (
        <span onClick={() => {this.myInp.focus()}} className="search-text"><i className="fas fa-search small"></i>Search</span>
      )}

</span>
  )
}


}

const mapStateToProps = (state) => {
  return {
    //oidc: state.oidc,
    search: state.search,
  };
};

function mapDispatchToProps(dispatch) {
  let actions =  bindActionCreators({ searchSave }, dispatch);
  return { ...actions, dispatch };
}


export default connect(mapStateToProps, mapDispatchToProps)(Search)