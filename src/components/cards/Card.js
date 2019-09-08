import React, { Component } from "react";
import UnFavorite from "../../resources/img/full_heart_white.png";
import Favorite from "../../resources/img/full_heart_purple.png";
import MessageWhite from "../../resources/img/message.png";
import MessagePurple from "../../resources/img/comments@3x.png";
import CallWhite from "../../resources/img/call.png";
import CallPurple from "../../resources/img/call-purple.png";
import MapWhite from "../../resources/img/map.png";
import MapPurple from "../../resources/img/map-purple.png";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { colorSave } from "../../redux/actions/color";
import Loading from "../main/Loading";
import API from "../../utils/API";
import { push } from "connected-react-router";
import { withKeycloak } from "react-keycloak";
import { firstFavoriteSave } from "../../redux/actions/firstFavorite";
import { toast } from "react-toastify";
import NotifBubble from "./NotifBubble";
import { FavError, FavSuccess1, FavSuccess2, FavErrorMsg, FavErrorCall, MapText, CallText, MessageText } from "../../config/strings";
import getColors from "get-image-colors";
import { lightestColor } from "../../utils/color"

/**
 * Primary card component - represents each individual main card
 */
class Card extends Component {
    constructor() {
        super();
        this.state = {
            data: {},
        };
        this.routeChange = this.routeChange.bind(this);
        this.handleFavorite = this.handleFavorite.bind(this);
        this.launchErrorModal = this.launchErrorModal.bind(this);
        this.handleMessageClick = this.handleMessageClick.bind(this);
        this.handleCallClick = this.handleCallClick.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        // Somewhat vestigial code, can likely be changed/removed soon
        let merchant = {};
        merchant = props.merchant;
        return { merchant: merchant, bubblemsg: props.bubblemsg };
    }

    routeChange = e => {
        if (this.props.merchant.id === 0) {
            e.preventDefault();
            e.stopPropagation();
            this.launchErrorModal(
                { FavError }
            );
            return;
        }
        if (
            e.target.className === "notif-bubble-link" ||
            e.target.className === "notif-bubble slide-in-right"
        ) {
            return;
        } else if (e.target.nodeName === "LI" || e.target.nodeName === "a") {
            return;
        }

        let path = "/detail/" + this.state.merchant.id;
        this.props.dispatch(push(path));
    };

    configuration(data) {
        let merchant = this.state.merchant;
        merchant.isFavorite = !merchant.isFavorite;
        this.setState({ merchant: merchant });
    }

    launchInsiderModal() {
        toast.info(
            <span>
                {FavSuccess1}
                <span class="find-more">
                    <Link to="/">{FavSuccess2}</Link>
                </span>
            </span>,
            {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 7000
            }
        );
    }

    launchErrorModal(text) {
        toast.error(<span>{text}</span>, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 7000
        });
    }

    firstTimeFavoriteCheck() {
        this.launchInsiderModal();
    }

    handleMessageClick(e) {
        if (this.state.merchant.isFavorite === false) {
            this.launchErrorModal(
                { FavErrorMsg }
            );
            return;
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
        }

        let path = "/chat/" + this.state.merchant.id;

        this.props.dispatch(push(path));
    }

    handleCallClick(e) {
        if (this.state.merchant.isFavorite === false) {
            e.preventDefault();
            e.stopPropagation();
            this.launchErrorModal(
                { FavErrorCall }
            );
        }
    }

    handleFavorite(e) {
        e.stopPropagation();
        if (this.props.keycloak.authenticated) {
            if (this.state.merchant.isFavorite !== true) {
                this.firstTimeFavoriteCheck();
            }
            let api = new API(this.props.keycloak);
            let body = {
                merchantId: this.state.merchant.id,
                status: !this.state.merchant.isFavorite
            };
            api.setRetry(3);
            api
                .post("favoriteMerchantAPI", { body: body })
                .then(response => this.configuration(response.data))
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    if(error) {
        console.log(error);
        return <p>{error.message}</p>;
    }

    if(isLoading) {
        return <Loading />;
    }

    componentDidMount() {
        if (typeof this.props.merchant !== "undefined") {
            getColors(this.props.merchant.logo).then(colors => {
                let colorsRGBA = colors.map(color => color.rgba());
                let hsla = lightestColor(colorsRGBA);
                let merchantId = this.props.merchant.id;
                this.setState({ cardColor: hsla });
                this.props.colorSave({ color: hsla, id: merchantId });
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.bubblemsg !== prevState.bubblemsg) {
            this.setState({ bubblemsg: this.props.bubblemsg });
        }
    }

    render() {
        if (!this.state.data) {
            return <div />;
        }

        return (
            <div
                className="card titlecard"
                onClick={this.routeChange}
                data-image={this.state.merchant.coverPhoto}
                style={{ backgroundImage: `url(${this.state.merchant.coverPhoto})` }}
            >
                {this.state.bubblemsg ? (
                    <NotifBubble
                        message={this.state.bubblemsg}
                        merchant={this.state.merchant}
                    />
                ) : null}
                <div
                    className="layer"
                    style={{ backgroundColor: this.state.cardColor }}
                >
                </div>
                <div className="graycard" />
                <CardLeft merchant={this.state.merchant} />
                <CardRight
                    merchant={this.state.merchant}
                    handleFavorite={this.handleFavorite}
                    handleMessageClick={this.handleMessageClick}
                    createCallLink={this.createCallLink}
                    createMapLink={this.createMapLink}
                    {...this.props}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        color: state.color,
        firstFavorite: state.firstFavorite,
        router: state.router
    };
};

function mapDispatchToProps(dispatch) {
    let actions = bindActionCreators({ colorSave, firstFavoriteSave }, dispatch);
    return { ...actions, dispatch };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withKeycloak(Card));

/**
 * Represents the left part of the primary card - right now, just the logo
 */
class CardLeft extends Component {
    render() {
        return (
            <div className="card-left">
                <div className="card-logo">
                    <img className="card-logo-img" src={this.props.merchant.logo} />
                </div>
            </div>
        )
    }
}

/**
 * Represents the right part of the primary card - including the clickable favorite, the nav, address and merchant name
 */
class CardRight extends Component {

    render() {
        return (
            <div className="card-right">
                {this.props.merchant.isFavorite ? (
                    <img
                        className={`card-favorite purple-favorite`}
                        onClick={this.props.handleFavorite}
                        src={Favorite}
                    />
                ) : (
                        <img
                            className={`card-favorite white-favorite`}
                            onClick={this.props.handleFavorite}
                            src={UnFavorite}
                        />
                    )}

                <div className="card-right-bottom">
                    <h2 className="card-title">{this.props.merchant.name}</h2>
                    <div className="card-address">{this.props.merchant.address1}</div>
                    <hr />
                    <CardNav {...this.props} />
                </div>
            </div>
        )
    }
}

/**
 * The primary card navigation - message, call and map.
 */
class CardNav extends Component {
    render() {
        let Message = MessageWhite;
        let Call = CallWhite;
        let Map = MapWhite;

        if (this.props.router.location.pathname.includes("detail")) {
            Message = MessagePurple;
            Call = CallPurple;
            Map = MapPurple;
        }
        return (
            <div className="card-nav">
                <ul>
                    <a onClick={e => e.preventDefault()}>
                        <li onClick={this.props.handleMessageClick}>
                            {MessageText}
                            <img src={Message} />
                        </li>
                    </a>
                    <a onClick={this.props.handleCallClick} href={"tel:+" + this.props.merchant.phoneNumber}>
                        <li>
                            {CallText}
                            <img src={Call} />
                        </li>
                    </a>

                    <Link
                        to={{
                            pathname: "/map",
                            state: {
                                merchant_lat: this.props.merchant.latitude,
                                merchant_lng: this.props.merchant.longitude
                            }
                        }}
                    >
                        <li>
                            {MapText}
                            <img src={Map} />
                        </li>
                    </Link>
                </ul>
            </div>
        )
    }
}
