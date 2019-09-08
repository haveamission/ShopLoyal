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
        this.routeChange = this.routeChange.bind(this);
        this.handleFavorite = this.handleFavorite.bind(this);
        this.launchInsiderModal = this.launchInsiderModal.bind(this);
        this.launchErrorModal = this.launchErrorModal.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        // Somewhat vestigial code, can likely be changed/removed soon
        let merchant = {};
        merchant = props.merchant;
        return { merchant: merchant, bubblemsg: props.bubblemsg };
    }

    /**
     * This code prevents event bubbling when clicking on internal links in the card
     * @param {click event} event 
     */
    routeChange(event) {

        if (
            event.target.className === "notif-bubble-link" ||
            event.target.className === "notif-bubble slide-in-right"
        ) {
            return;
        } else if (event.target.nodeName === "LI" || event.target.nodeName === "a") {
            return;
        }

        let path = "/detail/" + this.state.merchant.id;
        this.props.dispatch(push(path));
    };

    updateFavoriteStatus(favoriteStatusData) {
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

    /**
     * Vestigial method from when we did a more extensive favorite check. Possibly remove and simply - keeping for now in case
     * SL team wants feature expansion
     */
    favoriteCheck() {
        this.launchInsiderModal();
    }

    /**
     * Handles favoriting and unfavoriting. Possible TODO - refactor into <CardRight />? This will have potential performance efficiency
     * but also requires re-architecting state/props for child component more thoroughly.
     * @param {the click event} event 
     */
    handleFavorite(event) {
        event.stopPropagation();
        if (this.props.keycloak.authenticated) {
            if (this.state.merchant.isFavorite !== true) {
                this.favoriteCheck();
            }
            let api = new API(this.props.keycloak);
            let body = {
                merchantId: this.state.merchant.id,
                status: !this.state.merchant.isFavorite
            };
            api.setRetry(3);
            api
                .post("favoriteMerchantAPI", { body: body })
                .then(response => this.updateFavoriteStatus(response.data))
                .catch(function (error) {
                    console.log(error);
                });
        }
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
                    launchErrorModal={this.launchErrorModal}
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
    constructor() {
        super();
        this.handleCallClick = this.handleCallClick.bind(this);
        this.handleMessageClick = this.handleMessageClick.bind(this);
    }

    handleCallClick(event) {
        if (this.props.merchant.isFavorite === false) {
            event.preventDefault();
            event.stopPropagation();
            this.props.launchErrorModal(
                FavErrorCall
            );
        }
    }

    handleMessageClick(event) {
        if (this.props.merchant.isFavorite === false) {
            this.props.launchErrorModal(
                FavErrorMsg
            );
            return;
            event.preventDefault();
            event.stopPropagation();
            event.nativeEvent.stopImmediatePropagation();
        }

        let path = "/chat/" + this.props.merchant.id;

        this.props.dispatch(push(path));
    }

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
                        <li onClick={this.handleMessageClick}>
                            {MessageText}
                            <img src={Message} />
                        </li>
                    </a>
                    <a onClick={this.handleCallClick} href={"tel:+" + this.props.merchant.phoneNumber}>
                        <li>
                            {CallText}
                            <img src={Call} />
                        </li>
                    </a>
                    {/* TODO: Send user to precise geolocation of the pin - code is theoretically created but not functional */}
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
