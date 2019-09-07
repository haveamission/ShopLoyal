import React, { Component } from "react";
import { connect } from "react-redux";
import "../resources/styles/chat.css";
import Loading from "./Loading";
import API from "./API";
import { withKeycloak } from "react-keycloak";
import TextareaAutosize from "react-autosize-textarea";
import { useSpring, animated } from "react-spring";
import moment from "moment";

function SlideUpChat(props) {
  const animationProps = useSpring({
    from: { transform: "translate3d(0,30%,0)", opacity: 0.25 },
    to: { transform: "translate3d(0,0%,0)", opacity: 1 }
  });

  return (
    <animated.div style={{ ...animationProps }}>
      {" "}
      {props.children}{" "}
    </animated.div>
  );
}

function generateMessage(message, index, additionalData) {
  let idval;
  let position;
  if (message.recipient === "merchant") {
    idval = 1;
    position = "right";
  } else if (message.recipient === "customer") {
    idval = 2;
    position = "left";
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
    document.body.style.position = "fixed";
    let userId = this.props.profile.id;
    this.createChannel(userId);
  }

  componentWillUpdate() {
    this.oldDate = null;
  }

  componentWillUnmount() {
    document.body.style.position = "static";
    clearInterval(this.interval);
  }

  openChannel() {
    let api = new API(this.props.keycloak);
    let merchant_id = this.props.location.pathname.substr(
      this.props.location.pathname.lastIndexOf("/") + 1
    );
    api
      .post("openChannel", { repl_str: merchant_id })
      .then(response => console.log(JSON.stringify(response.data)))
      .catch(function (error) {
        console.log(error);
      });
  }

  loadChannels(data) {
    this.createChannel(data.userId);
  }

  loadMessages(data) {
    let count = 0;

    let messagevals = [];

    data.reverse().forEach(function (obj) {
      messagevals.push(generateMessage(obj, count, {}));
      count++;
    });

    this.setState({ messages: messagevals });

    this.setState({ isLoading: false });
  }

  pullMessages() {
    let api = new API(this.props.keycloak);
    let merchant_id = this.props.location.pathname.substr(
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
      .catch(function (error) {
        console.log(error);
      });
  }

  pullChannels() {
    let api = new API(this.props.keycloak);
    api
      .get("channels")
      .then(response => this.loadChannels(response.data))
      .catch(function (error) {
        console.log(error);
      });
  }

  createChannel(userId) {
    let api = new API(this.props.keycloak);
    let channelId =
      this.props.location.pathname
        .substr(this.props.location.pathname.lastIndexOf("/") + 1)
        .toString() +
      "-" +
      userId.toString();
    let body = {
      merchantId: this.props.location.pathname.substr(
        this.props.location.pathname.lastIndexOf("/") + 1
      ),
      channelId: channelId
    };
    api
      .post("channel", { body: body })
      .then(response => console.log(response.data))
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this.openChannel();
    let userId = this.props.profile.id;
    this.createChannel(userId);

    window.addEventListener("keyboardDidHide", () => {
      // Describe your logic which will be run each time keyboard is closed.
      this.setState({ className: "default" });
    });

    window.addEventListener("keyboardDidShow", event => {
      this.setState({ className: "active", scrolled: false }, () => {
        this.scrollToBottom();
      });
      // Describe your logic which will be run each time when keyboard is about to be shown.
      console.log(event.keyboardHeight);
    });

    if (this.props.location.state) {
      this.setState({ merchantVal: this.props.location.state.merchant });
    } else {
      var merchant_id = this.props.location.pathname.substr(
        this.props.location.pathname.lastIndexOf("/") + 1
      );
      let query = {
        lat: this.props.coordinates.coords.latitude,
        lng: this.props.coordinates.coords.longitude,
        radius: "10.0",
        limit: "30",
        // TODO: Change this to be consistent with other search values
        search: ""
      };

      let api = new API(this.props.keycloak);
      api.setRetry(3);
      api
        .get("merchantDetailAPI", { repl_str: merchant_id, query: query })
        .then(response => this.merchantConfiguration(response.data))
        .catch(function (error) {
          console.log(error);
        });
    }

    this.pullMessages();
    this.interval = setInterval(() => this.updateMessages(), 25000);
  }

  merchantConfiguration(data) {
    this.setState({ merchantVal: data });
  }

  updateMessages() {
    this.pullMessages();
  }

  onSend() {
    if (this.state.text !== null || this.state.text !== "") {
      let messages = [this.state.text];
      this.setState({ text: "" });
      this.openChannel();
      for (let message of messages) {
        this.saveMessage(message);
        let messageHydrated = this.addMessageInfo(message);
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
    let body = {
      message: message
    };

    let api = new API(this.props.keycloak);

    let merchant_id = this.props.location.pathname.substr(
      this.props.location.pathname.lastIndexOf("/") + 1
    );
    api
      .post("merchantSendMessage", { body: body, repl_str: merchant_id })
      .then(response => console.log(response.data))
      .catch(function (error) {
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
      console.log("scrolls to bottom!");
      // TODO switch to react refs
      let bottomele = document.getElementById("bottom-scroll");
      if (bottomele !== null) {
        console.log("scroll into view!");
        bottomele.scrollIntoView();
        bottomele.focus();
        this.setState({ scrolled: true });
      }
    }
  };

  showDate(timestamp) {
    if (this.oldDate !== null) {
      // Maybe add M calculation as well
      let newDate = moment(timestamp).format("D");
      let oldDate = moment(this.oldDate).format("D");
      if (newDate === oldDate) {
        this.oldDate = timestamp;
        return false;
      }
    }
    this.oldDate = timestamp;
    return true;
  }

  render() {

    if (this.state.isLoading) {
      return <Loading />;
    } else {
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
                <SlideUpChat>
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
                </SlideUpChat>
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

          <div className="msginput">
            <div className="inner-keyboard">
              <TextareaAutosize
                value={this.state.text}
                onChange={evt => this.handleChange(evt)}
                maxRows={3}
                placeholder="Message..."
                className="textareainput"
                onResize={e => { }}
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
