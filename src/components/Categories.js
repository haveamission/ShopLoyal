import React, { Component } from 'react';
import categories from '../actions/categories'
import {bindActionCreators} from 'redux'
import { connect } from "react-redux";

class Categories extends Component {
  constructor() {
    super();
    this.state = {
      cats: ["All", "Shop", "Food", "Fun", "Salon", "Tech", "Health"],
        }
  }



  componentDidMount() {
    this.setState({selectedCat: this.props.category.category});

  }
  rootClassNames(cat) {
    if(this.state.selectedCat == "" && cat == "All") {
      return "selected"
    }
    else if(cat === this.state.selectedCat) {
      return "selected"
    }
  }

  handleClick = (cat) => {
var value = cat;
if(value === "All") {
  value = "";
}
this.setState({selectedCat: value});
this.props.categories(value);
  }

  render(){
    //console.log("states and props categories");
    //console.log(this.state);
    //console.log(this.props);
    return(
      <ul className="categories">
          {this.state.cats.map( cat =>
     <li className={this.rootClassNames(cat)} onClick={() => this.handleClick(cat)} key={cat}>{cat}</li>
  )}
    </ul>
  );
}
}
  
const mapStateToProps = (state) => {
  return {
    category: state.categories,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ categories }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Categories)