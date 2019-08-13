import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import "./chat.css";
import Loading from "./Loading";
import axios from "axios";
import API from "./API";
import { bindActionCreators } from "redux";
import { withKeycloak } from "react-keycloak";
import TextareaAutosize from "react-autosize-textarea";
const moment = require("moment");
const format = require("string-format");

const messages = [];

function generateMessage(message, index, additionalData) {
  if (message.recipient == "merchant") {
    var idval = 1;
    var position = "right";
  } else if (message.recipient == "customer") {
    var idval = 2;
    var position = "left";
  }
  return {
    id: message.id,
    text: message.message,
    createdAt: message.createdAt,
    position: position,
    user: {
      id: idval,
      name: "Generic"
    },
    ...additionalData
  };
}

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [{}],
      merchant: { id: null },
      isLoading: true,
      text: "",
      keyboardVal: 0,
      merchantVal: "",
      scrolled: false,
      className: "default"
    };
    this.goBack = this.goBack.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  oldDate = null;

  messagesEndRef = React.createRef();

  componentWillMount() {
    console.log("THIS PROPS CHAT");
    console.log(this.props);
    document.body.style.position = "fixed";
    var userId = this.props.profile.id;
    this.createChannel(userId);
  }

  componentWillUpdate() {
    this.oldDate = null;
  }

  componentWillUnmount() {
    document.body.style.position = "static";
    console.log("merchant data");
    console.log(this.props);
    // What is this for? Commented out for now.
    //this.setState({ "merchantName": this.props.location.state.merchant.name });
    clearInterval(this.interval);
  }

  openChannel() {
    var api = new API(this.props.keycloak);
    var merchant_id = this.props.location.pathname.substr(
      this.props.location.pathname.lastIndexOf("/") + 1
    );
    api
      .post("openChannel", { repl_str: merchant_id })
      .then(response => console.log(JSON.stringify(response.data)))
      .catch(function(error) {
        console.log(error);
      });
  }

  loadChannels(data) {
    this.createChannel(data.userId);
  }

  loadMessages(data) {
    //console.log("loaded messages");
    //console.log(data);

    var count = 0;

    var messagevals = [];

    data.reverse().forEach(function(obj) {
      //console.log(obj.message);
      messagevals.push(generateMessage(obj, count, {}));
      count++;
    });

    //console.log(messagevals);

    this.setState({ messages: messagevals });

    this.setState({ isLoading: false });

    //console.log(data.map(obj => obj.message));
  }

  pullMessages() {
    var api = new API(this.props.keycloak);
    var merchant_id = this.props.location.pathname.substr(
      this.props.location.pathname.lastIndexOf("/") + 1
    );
    this.setState({ date: null });
    this.oldDate = null;
    api
      .get("merchantMessages", { repl_str: merchant_id })
      .then(response => {
        this.loadMessages(response.data);
        this.scrollToBottom();
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  pullChannels() {
    var api = new API(this.props.keycloak);
    api
      .get("channels")
      .then(response => this.loadChannels(response.data))
      .catch(function(error) {
        console.log(error);
      });
  }

  createChannel(userId) {
    var api = new API(this.props.keycloak);
    var channelId =
      this.props.location.pathname
        .substr(this.props.location.pathname.lastIndexOf("/") + 1)
        .toString() +
      "-" +
      userId.toString();
    console.log("channelId");
    console.log(channelId);
    console.log("merchantId");
    console.log(
      this.props.location.pathname.substr(
        this.props.location.pathname.lastIndexOf("/") + 1
      )
    );
    var body = {
      merchantId: this.props.location.pathname.substr(
        this.props.location.pathname.lastIndexOf("/") + 1
      ),
      channelId: channelId
    };
    api
      .post("channel", { body: body })
      .then(response => console.log(response.data))
      .catch(function(error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this.openChannel();
    var userId = this.props.profile.id;
    this.createChannel(userId);

    window.addEventListener("keyboardDidHide", () => {
      // Describe your logic which will be run each time keyboard is closed.
      this.setState({ className: "default" });
    });

    window.addEventListener("keyboardDidShow", event => {
      this.setState({ className: "active" });
      // Describe your logic which will be run each time when keyboard is about to be shown.
      console.log(event.keyboardHeight);
    });

    console.log("did mount again");
    console.log("LOCATION VALUES");
    console.log(this.props.location);

    if (this.props.location.state) {
      this.setState({ merchantVal: this.props.location.state.merchant });
    } else {
      var merchant_id = this.props.location.pathname.substr(
        this.props.location.pathname.lastIndexOf("/") + 1
      );
      var query = {
        lat: this.props.coordinates.coords.latitude,
        lng: this.props.coordinates.coords.longitude,
        radius: "10.0",
        limit: "30",
        // TODO: Change this to be consistent with other search values
        search: ""
      };

      var api = new API(this.props.keycloak);
      api.setRetry(3);
      api
        .get("merchantDetailAPI", { repl_str: merchant_id, query: query })
        .then(response => this.merchantConfiguration(response.data))
        .catch(function(error) {
          console.log(error);
        });
    }

    //console.log(this.state);
    //console.log("chat props");
    //console.log(this.props);

    this.pullMessages();
    this.interval = setInterval(() => this.updateMessages(), 25000);
    /*this.scrollToBottom();
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);*/
  }

  merchantConfiguration(data) {
    //console.log("merchant data");
    //console.log(data);
    this.setState({ merchantVal: data });
    //console.log("card row data");
    //console.log(data);
  }

  updateMessages() {
    console.log("update messages");
    this.pullMessages();
    //this.scrollToBottom();
  }

  onSend() {
    if (this.state.text !== null || this.state.text !== "") {
      var messages = [this.state.text];
      this.setState({ text: "" });
      this.openChannel();
      for (let message of messages) {
        //console.log(message);
        this.saveMessage(message);
        var messageHydrated = this.addMessageInfo(message);
        this.setState({ messages: [...this.state.messages, messageHydrated] });
      }
      if (window.Keyboard) {
        window.Keyboard.hide();
      }
      this.setState({ scrolled: false }, () => {
        this.scrollToBottom();
      });
    }
  }

  addMessageInfo(message) {
    return {
      text: message,
      position: "right"
    };
  }

  saveMessage(message) {
    var body = {
      message: message
    };

    console.log("BODY GOES HERE");
    console.log(body);

    var api = new API(this.props.keycloak);

    var merchant_id = this.props.location.pathname.substr(
      this.props.location.pathname.lastIndexOf("/") + 1
    );
    api
      .post("merchantSendMessage", { body: body, repl_str: merchant_id })
      .then(response => console.log(response.data))
      .catch(function(error) {
        console.log(error);
      });
  }

  goBack() {
    this.props.history.goBack();
  }

  chatClicked = props => {
    if (window.Keyboard) {
      window.Keyboard.hide();
    }
  };

  handleChange(event) {
    this.setState({
      text: event.target.value
    });
  }

  scrollToBottom = () => {
    // Hack due to reference not working for some reason
    if (this.state.scrolled === false) {
      var bottomele = document.getElementById("bottom-scroll");
      if (bottomele !== null) {
        console.log(bottomele);
        console.log("scroll to bottom");
        bottomele.scrollIntoView();
        bottomele.focus();
        this.setState({ scrolled: true });
      }
    }
  };

  componentDidUpdate() {
    //this.scrollToBottom();
  }

  /*shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps);
    console.log(nextState);
    if (this.state.date === false) {
      return false;
    }
    else {
      return true;
    }
  }*/

  showDate(timestamp) {
    if (this.oldDate !== null) {
      // Maybe add M calculation as well
      var newDate = moment(timestamp).format("D");
      var oldDate = moment(this.oldDate).format("D");
      if (newDate === oldDate) {
        this.oldDate = timestamp;
        //this.setState({ date: true })
        return false;
      }
    }
    this.oldDate = timestamp;
    return true;
  }

  render() {
    //var keyboardStyle = {transform: 'translate3d(0px, ' + this.state.keyboardVal + 'px, 0px)'}

    if (this.state.isLoading) {
      return <Loading />;
    } else {
      console.log(this.state.messages);
      console.log(this.props.location);
      console.log("router");
      console.log(this.props.router);
      return (
        <div>
          <div
            className="chat-container"
            style={{
              backgroundImage: `url(${this.state.merchantVal.coverPhoto})`
            }}
          />
          <div className="chat-title">{this.state.merchantVal.name}</div>
          <div
            id="messages-container"
            onClick={() => this.chatClicked()}
            style={{ transform: "translate3d(0, 0, 0)" }}
          >
            <div id="messages" style={{ transform: "translate3d(0, 0, 0)" }}>
              {this.state.messages.map((message, index) => (
                <div className={"message " + message.position} key={index}>
                  {this.showDate(message.createdAt, this.oldDate) ? (
                    <div>
                      {moment(message.createdAt).format("ddd, MMM D LT")}
                    </div>
                  ) : (
                    ""
                  )}
                  <span>{message.text}</span>
                </div>
              ))}
              <div
                className={"bottom-scroll " + this.state.className}
                id="bottom-scroll"
                ref={el => {
                  this.messagesEndRef = el;
                }}
              />
            </div>
          </div>

          <div /*onClick={() => {this.myChat.focus()}}*/ className="msginput">
            <div className="inner-keyboard">
              <TextareaAutosize
                //ref={(ic) => this.myChat = ic}
                value={this.state.text}
                onChange={evt => this.handleChange(evt)}
                maxRows={3}
                placeholder="Message..."
                className="textareainput"
                onResize={e => {}}
                name="msginput"
              />
              <div onClick={this.onSend} className="sendbutton">
                Send
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    profile: state.profile,
    coordinates: state.coordinates,
    router: state.router
  };
};

export default connect(mapStateToProps)(withKeycloak(Chat));
