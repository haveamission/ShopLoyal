import React, { Component } from "react";
import { connect } from "react-redux";
import "../../resources/styles/chat.css";
import Loading from "../main/Loading";
import API from "../../utils/API";
import { withKeycloak } from "react-keycloak";
import TextareaAutosize from "react-autosize-textarea";
import { useSpring, animated } from "react-spring";
import moment from "moment";
import { smallRadius, largeLimit } from "../../config/constants"
import { getMerchantIDFromPath, genChannelName } from "../../utils/misc"


/**
 * Configures chat message slide up. Should likely be reconfigured
 */
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

/**
 * This is the chat component
 */
class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messages: [{}],
      isLoading: true,
      text: "",
      merchantData: {},
      scrolled: false,
      className: "default"
    };
    this.onSend = this.onSend.bind(this);
    this.generateMessage = this.generateMessage.bind(this);
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

  generateMessage(message, index) {
    let position;
    if (message.recipient === "merchant") {
      position = "right";
    } else if (message.recipient === "customer") {
      position = "left";
    }
    let messageObj = {
      id: message.id,
      text: message.message,
      createdAt: message.createdAt,
      position: position,
    };
    return messageObj;
  }

  openChannel() {
    let api = new API(this.props.keycloak);
    let merchantId = getMerchantIDFromPath(this.props.location);;
    api
      .post("openChannel", { repl_str: merchantId })
      .then(response => console.log(response.data))
      .catch(function (error) {
        console.log(error);
      });
  }

  loadChannels(channelData) {
    this.createChannel(channelData.userId);
  }

  loadMessages(messageData, self) {
    let count = 0;

    let messagevals = [];

    messageData.reverse().forEach(function (obj) {
      messagevals.push(self.generateMessage(obj, count));
      count++;
    });

    self.setState({ messages: messagevals });

    self.setState({ isLoading: false });
  }

  pullMessages() {
    let api = new API(this.props.keycloak);
    let merchantId = getMerchantIDFromPath(this.props.location);
    this.setState({ date: null });
    this.oldDate = null;
    let self = this;
    api
      .get("merchantMessages", { repl_str: merchantId })
      .then(response => {
        this.loadMessages(response.data, self);
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
    let merchantId = getMerchantIDFromPath(this.props.location);
    let channelId = genChannelName(merchantId, userId);
    let body = {
      merchantId: merchantId,
      channelId: channelId
    };
    api
      .post("channel", { body: body })
      .then(response => console.log(response.data))
      .catch(function (error) {
        console.log(error);
      });
  }

  keyboardListeners() {
    window.addEventListener("keyboardDidHide", () => {
      this.setState({ className: "default" });
    });

    window.addEventListener("keyboardDidShow", event => {
      this.setState({ className: "active", scrolled: false }, () => {
        this.scrollToBottom();
      });
    });
  }

  /**
   * Checks if the pathing sent the merchant correctly. If not, provides a failsafe to grab the merchant to prevent errors
   */
  checkMerchantAndSet() {
    if (this.props.location.state) {
      this.setState({ merchantData: this.props.location.state.merchant, merchantId: this.props.location.state.merchant.id });
    } else {
      let merchantId = getMerchantIDFromPath(this.props.location);
      this.setState({ merchantId: merchantId });
      let query = {
        lat: this.props.coordinates.coords.latitude,
        lng: this.props.coordinates.coords.longitude,
        radius: smallRadius,
        limit: largeLimit,
        search: ""
      };

      let api = new API(this.props.keycloak);
      api.setRetry(3);
      api
        .get("merchantDetailAPI", { repl_str: merchantId, query: query })
        .then(response => this.merchantConfiguration(response.data))
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  componentDidMount() {
    this.checkMerchantAndSet();
    this.openChannel();
    let userId = this.props.profile.id;
    this.createChannel(userId);
    this.keyboardListeners();
    this.pullMessages();
    // TODO replace with web socket/pinger
    this.interval = setInterval(() => this.updateMessages(), 25000);
  }

  merchantConfiguration(merchantData) {
    this.setState({ merchantData: merchantData });
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

    let merchantId = getMerchantIDFromPath(this.props.location);;
    api
      .post("merchantSendMessage", { body: body, repl_str: merchantId })
      .then(response => console.log(response.data))
      .catch(function (error) {
        console.log(error);
      });
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
      // TODO switch to react refs time permitting
      let bottomele = document.getElementById("bottom-scroll");
      if (bottomele !== null) {
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
              backgroundImage: `url(${this.state.merchantData.coverPhoto})`
            }}
          />
          <div className="chat-title">{this.state.merchantData.name}</div>
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
