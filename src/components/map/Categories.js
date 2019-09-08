import React, { Component } from "react";
import categories from "../../redux/actions/categories";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

class Categories extends Component {
  constructor() {
    super();
    // TODO switch over to strings.js for easier future localization
    this.state = {
      cats: ["All", "Shop", "Food", "Fun", "Salon", "Tech", "Health"]
    };
  }

  componentDidMount() {
    this.setState({ selectedCat: this.props.category.category });
  }
  rootClassNames(cat) {
    if (this.state.selectedCat === "" && cat === "All") {
      return "selected";
    } else if (cat === this.state.selectedCat) {
      return "selected";
    }
  }

  handleClick = cat => {
    let value = cat;
    if (value === "All") {
      value = "";
    }
    this.setState({ selectedCat: value });
    this.props.categories(value);
  };

  render() {
    return (
      <ul className="categories">
        {this.state.cats.map(cat => (
          <li
            className={this.rootClassNames(cat)}
            onClick={() => this.handleClick(cat)}
            key={cat}
          >
            {cat}
          </li>
        ))}
      </ul>
    );
  }
}

const mapStateToProps = state => {
  return {
    category: state.categories
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ categories }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Categories);
