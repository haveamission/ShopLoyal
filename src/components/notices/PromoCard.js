import React, { Component } from 'react';
import { connect } from 'react-redux'


class PromoCard extends Component {

    componentWillMount() {
        let colorArr = ["#536DFE", "#5C6BC0", "#969FA2", "#27295F", "#FFD138", "#DDDDDD"];
        this.rand = colorArr[Math.floor(Math.random() * colorArr.length)];

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.color !== this.props.color) {
            if (this.props.color[this.props.merchant_id] !== null) {
                this.rand = this.props.color[this.props.merchant_id];
            }
        }
    }

    componentDidMount() {

        if (this.props.color[this.props.merchant_id] !== null) {
            this.rand = this.props.color[this.props.merchant_id];
        }

    }
    render() {
        return (
            <div className={"card promocard promocard-" + this.props.count}>
                <div className="promo-name" style={{ backgroundColor: this.rand }}><img src={this.props.data.merchant.logo} />{this.props.data.merchant.name}</div>
                <img className="promo-main-img" src={this.props.data.photo} />
                <div className="promo-title">{this.props.data.title}</div>
                <div className="promo-desc">{this.props.data.text}</div>
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