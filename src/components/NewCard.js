import React, { Component } from "react";
import UnFavorite from "../img/full_heart_white.png";
import Favorite from "../img/full_heart_purple.png";
import GrayCard from "../img/gray.png";
import MessageTextWhite from "../img/message.png";
import MessageTextPurple from "../resources/img/comments@3x.png";
import CallWhite from "../img/call.png";
import CallPurple from "../resources/img/call-purple.png";
import MapWhite from "../img/map.png";
import MapPurple from "../resources/img/map-purple.png";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { colorSave } from "../actions/color";
import Loading from "./Loading";
import API from "./API";
import { push } from "connected-react-router";
import { withKeycloak } from "react-keycloak";
import Skeleton from "react-loading-skeleton";
import BackgroundImageOnLoad from "background-image-on-load";
// TODO replace all actions with action file
import { firstFavoriteSave } from "../actions/firstFavorite";
import { toast } from "react-toastify";
import NotifBubble from "./NotifBubble";
import axios from "axios";
import { FavError, FavSuccess1, FavSuccess2, FavErrorMsg, FavErrorCall } from "../config/strings";
const getColors = require("get-image-colors");

class Card extends Component {
    constructor() {
        super();
        this.state = {
            data: {},
        };
        this.routeChange = this.routeChange.bind(this);
        this.handleFavorite = this.handleFavorite.bind(this);
        this.handleLinks = this.handleLinks.bind(this);
        this.launchErrorModal = this.launchErrorModal.bind(this);
        this.handleMessageClick = this.handleMessageClick.bind(this);
        this.handleCallClick = this.handleCallClick.bind(this);
    }

    createChatLink() {
        var path = "#/chat/" + this.state.merchant.id;
        if (this.props.merchant.id === 0) {
            path = "";
        }

        return path;
    }

    createCallLink() {
        var path = "tel:+" + this.state.merchant.phoneNumber;
        if (this.props.merchant.id === 0) {
            path = "#";
        }
        return path;
    }

    createMapLink() {
        var path = "/map";
        if (this.props.merchant.id === 0) {
            path = "";
        }
        return path;
    }

    static getDerivedStateFromProps(props, state) {
        // Normalizing the data, as react adds an object wrapper sometimes

        var merchant = {};

        if (typeof props.merchant.merchant !== "undefined") {
            merchant = props.merchant.merchant;
        } else {
            merchant = props.merchant;
        }
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
        var merchant = this.state.merchant;
        merchant.isFavorite = !merchant.isFavorite;
        this.setState({ merchant: merchant });
    }

    handleLinks(e) {
        //e.stopPropagation();
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
        /*
        if (
          this.props.router.location.pathname.includes(
            "detail"
          ) /*&& this.props.firstFavorite === null*/
        /*) {
          //this.props.firstFavoriteSave(true);
          this.launchInsiderModal();
        }*/
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

        var path = "/chat/" + this.state.merchant.id;
        if (this.props.merchant.id === 0) {
            path = "";
            return;
        }

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
        if (this.props.merchant.id === 0) {
            return;
        }
        e.stopPropagation();
        if (this.props.keycloak.authenticated) {
            if (this.state.merchant.isFavorite !== true) {
                this.firstTimeFavoriteCheck();
            }
            var api = new API(this.props.keycloak);
            var body = {
                merchantId: this.state.merchant.id,
                status: !this.state.merchant.isFavorite
            };
            api.setRetry(10);
            api
                .post("favoriteMerchantAPI", { body: body })
                .then(response => this.configuration(response.data))
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    lightestColor(colors) {
        var highestColor;
        var hspHighest = 0;
        colors.forEach(function (color) {
            var lightness = lightOrDark(color);
            if (lightness > hspHighest && lightness < 200) {
                hspHighest = lightness;
                highestColor = color;
            }
        });
        var hsla = hexToRgbA(highestColor);
        this.setState({ cardColor: hsla });
        var merchantId = this.props.merchant.id;
        this.props.colorSave({ color: hsla, id: merchantId });
    }

    if(error) {
        console.log(error);
        return <p>{error.message}</p>;
    }

    if(isLoading) {
        return <Loading />;
    }

    componentDidMount() {
        // Not ideal - deal with how react does this later

        this.lightestColorGen();
    }

    lightestColorGen() {
        if (typeof this.props.merchant !== "undefined") {
            var that = this;
            getColors(this.props.merchant.logo).then(colors => {
                // Should probably rewrite to make better use of chroma.js functions
                var colorsHSLA = colors.map(color => color.hsl());
                var colorsHex = colors.map(color => color.hex());
                that.lightestColor(colorsHex);
            });
            //TODO: if android, do this:
            /*this.getBase64(this.props.merchant.logo).then(function(base64) {
              getColors(base64).then(colors => {
                // Should probably rewrite to make better use of chroma.js functions
                var colorsHSLA = colors.map(color => color.hsl());
                var colorsHex = colors.map(color => color.hex());
                that.lightestColor(colorsHex);
              });
            });*/
        }
    }

    getBase64(url) {
        return axios
            .get(url, {
                responseType: "arraybuffer",
                headers: {
                    Origin: "Shoployal"
                }
            })
            .then(response => new Buffer(response.data, "binary"));
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.bubblemsg !== prevState.bubblemsg) {
            this.setState({ bubblemsg: this.props.bubblemsg });
        }
    }

    componentWillUnmount() {
        // indicate that the component has been unmounted
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

class CardNav extends Component {

    render() {
        console.log("location props");
        console.log(this.props);
        var MessageText = MessageTextWhite;
        var Call = CallWhite;
        var Map = MapWhite;

        if (this.props.router.location.pathname.includes("detail")) {
            MessageText = MessageTextPurple;
            Call = CallPurple;
            Map = MapPurple;
        }

        return (
            <div className="card-nav">
                <ul>
                    <a onClick={e => e.preventDefault()}>
                        <li onClick={this.props.handleMessageClick}>
                            Message
<img src={MessageText} />
                        </li>
                    </a>
                    <a onClick={this.props.handleCallClick} href={"tel:+" + this.props.merchant.phoneNumber}>
                        <li>
                            Call
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
                            Map
<img src={Map} />
                        </li>
                    </Link>
                </ul>
            </div>
        )
    }
}

function lightOrDark(color) {
    // Variables for red, green, blue values
    var r, g, b, hsp;

    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
        // If HEX --> store the red, green, blue values in separate variables
        color = color.match(
            /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
        );

        r = color[1];
        g = color[2];
        b = color[3];
    } else {
        // If RGB --> Convert it to HEX: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"));

        r = color >> 16;
        g = (color >> 8) & 255;
        b = color & 255;
    }

    // HSP (Highly Sensitive P) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

    // Return HSP value
    return hsp;
}

function hexToRgbA(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split("");
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = "0x" + c.join("");
        var rgba =
            "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + ",.8)";
        rgba = rgba
            .substring(5, rgba.length - 1)
            .replace(/ /g, "")
            .split(",");
        var hsla = RGBAToHSLA(rgba[0], rgba[1], rgba[2], rgba[3]);
        return hsla;
    }
    throw new Error("Bad Hex");
}

function RGBAToHSLA(r, g, b, a) {
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);

    console.log("red " + r);
    console.log("green " + g);
    console.log("blue " + b);

    // TODO: Worry about color correction later

    /*if(r + g + b > 650) {
    var colorArr = ['r', 'g', 'b'];
    var rand = colorArr[Math.floor(Math.random() * colorArr.length)];
    window.rand = window.rand - 100;
    }*/

    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    // Calculate hue
    // No difference
    if (delta === 0) h = 0;
    // Red is max
    else if (cmax === r) h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax === g) h = (b - r) / delta + 2;
    // Blue is max
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0) h += 360;

    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    var hsla = "hsla(" + h + "," + "50" + "%," + "50" + "%," + a + ")";
    return hsla;
}

function generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}
