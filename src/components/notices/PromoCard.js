import React, { Component } from 'react';
import { connect } from 'react-redux'

/**
 * This is the component for the promo or notice cards
 */
class PromoCard extends Component {

    componentWillMount() {
        // TODO get instructions for how promocards should have their headers colored - this is dependent on how we want to deal with
        // them
        let colorArr = ["#536DFE", "#5C6BC0", "#969FA2", "#27295F", "#FFD138", "#DDDDDD"];
        this.rand = colorArr[Math.floor(Math.random() * colorArr.length)];

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.color !== this.props.color) {
            if (this.props.color[this.props.merchantId] !== null) {
                this.rand = this.props.color[this.props.merchantId];
            }
        }
    }

    componentDidMount() {

        if (this.props.color[this.props.merchantId] !== null) {
            this.rand = this.props.color[this.props.merchantId];
        }

    }
    render() {
        return (
            <div className={"card promocard promocard-" + this.props.count}>
                <div className="promo-name" style={{ backgroundColor: this.rand }}><img src={this.props.promo.merchant.logo} />{this.props.promo.merchant.name}</div>
                <img className="promo-main-img" src={this.props.promo.photo} />
                <div className="promo-title">{this.props.promo.title}</div>
                <div className="promo-desc">{this.props.promo.text}</div>
                <div className="promo-false-bottom"></div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        color: state.color,
    };
};

export default connect(mapStateToProps)(PromoCard);