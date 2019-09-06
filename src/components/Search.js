import React, { Component } from "react";
import { connect } from "react-redux";
import searchSave from "../actions/search";
import { bindActionCreators } from "redux";
import { push } from "connected-react-router";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      typing: false,
      typingTimeout: 0,
      value: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.keyPress = this.keyPress.bind(this);
  }

  myInp = {
    value: ""
  };

  componentDidMount() {
    if (
      this.props.search.search !== "" &&
      this.props.router.location.pathname === "/map"
    ) {
      console.log("router value here");
      console.log(this.props.router);
      this.setState({ value: this.props.search.search });
    }
  }

  searchForText = text => {
    this.props.searchSave(text);
    //this.setState({value: null});
    if (typeof window.Keyboard.show !== "undefined") {
      window.Keyboard.hide();
    }

    this.props.dispatch(push("/map"));
    //this.deleteSearch();
    //alert(JSON.stringify((this.props.search));
    //this.setState({ value: this.props.search });
  };

  keyPress(event) {
    var code = event.keyCode ? event.keyCode : event.which;
    if (code === 13) {
      this.props.dispatch(push("/map"));
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
    const self = this;

    if (self.state.typingTimeout) {
      clearTimeout(self.state.typingTimeout);
    }

    self.setState({
      text: event.target.value,
      typing: false,
      typingTimeout: setTimeout(function () {
        self.searchForText(self.state.text);
      }, 2000)
    });
  }

  deleteSearch() {
    this.setState({ value: "" });
    if (this.myInp !== null) {
      this.myInp.value = "";
    }
    this.props.searchSave("");
    //this.props.dispatch(push("/"));
  }

  /*render(){
    return(
      <span className="search-text">
            {this.state.value ? (
        <i className="fas fa-times small"></i>
      ) : (
        <i className="fas fa-search small"></i>
      )}
      <input className="" placeholder="Search" onChange={this.handleChange}></input>
      </span>
  )
}*/

  render() {
    console.log(this.state.value);
    return (
      <span className="search-wrapper">
        {this.state.value ? (
          <i
            onClick={() => this.deleteSearch()}
            className="fas fa-times large"
          />
        ) : (
            <span
              onClick={() => {
                this.props.dispatch(push("/map"));
              }}
              className="search-text"
            >
              <i className="fas fa-search small" />
              Search
          </span>
          )}
        <input
          ref={ip => (this.myInp = ip)}
          className="search-input"
          onKeyPress={this.keyPress}
          onChange={this.handleChange}
          placeholder="to add your favorite merchants"
          value={this.state.value}
        />
        {this.state.value ? "" : ""}
      </span>
    );
  }
}

const mapStateToProps = state => {
  return {
    //oidc: state.oidc,
    search: state.search,
    router: state.router
  };
};

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({ searchSave }, dispatch);
  return { ...actions, dispatch };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
