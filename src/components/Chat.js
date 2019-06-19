import React, {Component} from 'react';
import {GiftedChat, Bubble} from 'react-web-gifted-chat';
import Background from "../img/fake_background_card.png";
import Page from './Page';
import ChatMessage from './ChatMessage.js';
import emojiUtils from 'emoji-utils';
import { Platform } from 'react-native';
import Send from './Send';
import Composer from './Composer';
import InputToolbar from './InputToolbar';
import SLBubble from './SLBubble'
import { isSameUser, isSameDay } from './utils'
import axios from 'axios'
import API from './API'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import { withKeycloak } from 'react-keycloak';
import Loading from './Loading';
const format = require('string-format')

const messages = [];

function generateMessage(message, index, additionalData) {
  if(message.recipient == 'merchant') {
var idval = 1;
  }
  else if(message.recipient == 'customer') {
var idval = 2;
  }
  return {
    id: message.id,
    text: message.message,
    createdAt: message.createdAt,
user: {
id: idval,
name: "Generic"
},
    ...additionalData,
  }
}

class Chat extends Component {
  constructor() {
    super()
    this.state = {
      messages: [],
      merchant: {"id": 37},
      isLoading: true,
    }
    this.goBack = this.goBack.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  renderLoading() {
    return (<Loading />)
  }

  saveMessage(message) {
    let config = {
      headers: {
        'Authorization': "Bearer " + this.props.keycloak.idToken,
      }
    }

    var body = {
      "message": message
    }

    console.log("chat url");
    console.log(API.prodBaseUrlString + format(API.merchantSendMessage, this.state.merchant.id));

axios.post(API.prodBaseUrlString + format(API.merchantSendMessage, this.state.merchant.id), body, config).then(
response => console.log(response.data)
).catch(function(error) {
console.log(error);
})
  }

  onSend(messages) {
    for(let message of messages){
      console.log(message);
      this.saveMessage(message);
      this.setState({messages: [message,...this.state.messages]})
    }
  }

  loadChannels(data) {
console.log("loaded channels");
console.log(data);
this.pullChannel(data.userId);
  }

  loadMessages(data) {
    console.log("loaded messages");
console.log(data);

var count = 0;

var messagevals = [];

data.forEach(function(obj) {
console.log(obj.message);
messagevals.push(generateMessage(obj, count, {}));
count++;
});

console.log(messagevals);

this.setState({messages: messagevals});

this.setState({isLoading: false});

console.log(data.map(obj => obj.message));

  }
  
  loadChannel(data) {
    console.log("messages");
    console.log(this.state);
  console.log(data);
  }

  pullMessages() {
    let config = {
      headers: {
        Authorization: "Bearer " + this.props.keycloak.idToken,
      }
    }

console.log("merchant id");
console.log(this.state);
console.log(this.state.merchant.id);

var merchant_id = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);

axios.get(API.prodBaseUrlString + format(API.merchantMessages, merchant_id), config).then(
response => this.loadMessages(response.data)
).catch(function(error) {
console.log(error);
})
  }
  
  pullChannels() {
  
  let config = {
          headers: {
            Authorization: "Bearer " + this.props.keycloak.idToken,
          }
        }

        console.log("pull channels url");
        console.log(API.prodBaseUrlString + API.channels);
  
  axios.get(API.prodBaseUrlString + API.channels, config).then(
  response => this.loadChannels(response.data)
  ).catch(function(error) {
  console.log(error);
  })
  }
  
  pullChannel(userId) {

    console.log("makes it in pullChannel");
  
  let config = {
          headers: {
            Authorization: "Bearer " + this.props.keycloak.idToken,
          }
        }
        
  var body = {
  merchantId: this.state.merchant.id,
  channelId: this.state.merchant.id + "-" + userId,
  }
  
  axios.post(API.prodBaseUrlString + API.channel, body, config).then(
  response => this.loadChannel(response.data)
  ).catch(function(error) {
  console.log(error);
  })
  }

  componentWillMount() {
    this.setState({"merchantName": this.props.location.state.merchant.name});
  }

  componentDidMount() {
  console.log(this.state);
  console.log(this.props);
  
    if(this.props.keycloak.authenticated) {
      let config = {
        headers: {
          Authorization: "Bearer " + this.props.keycloak.idToken,
          //Origin: "App",
        }
      }
      //this.state.merchant.isFavorite
      console.log("Before favorite send");
this.pullMessages();
    
    }
  
  }

  renderMessage(props) {
    const { currentMessage: { text: currText } } = props;

    let messageTextStyle;

    // Make "pure emoji" messages much bigger than plain text.
    if (currText && emojiUtils.isPureEmojiString(currText)) {
      messageTextStyle = {
        fontSize: 28,
        // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
        lineHeight: Platform.OS === 'android' ? 34 : 30,
      };
    }

    return (
      <ChatMessage {...props} messageTextStyle={messageTextStyle} />
    );
  }

  renderFakeInputToolbar(props) {
    return (
      null
    )
  }

  renderInputToolbar(props){
    // Here you will return your custom InputToolbar.js file you copied before and include with your stylings, edits.
    return (
         <InputToolbar {...props} />
    )
}

renderBubble() {
  const bubbleProps = this.getInnerComponentProps();
  if (this.props.renderBubble) {
    return this.props.renderBubble(bubbleProps);
  }
  return <SLBubble {...bubbleProps} />;
}

  renderComposer() {
    return <Composer {...this.props} />;
  }

  renderSend = props => {
    return <Send/>;
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
console.log(window);
console.log(window.Keyboard);
console.log(window.NativeKeyboard);

var that = this;

window.NativeKeyboard.showMessenger({
  onSubmit: function(text) {
    that.onSend([text]);
  },
  showKeyboard: true,
  autocorrectionEnabled: true,
  placeholder: 'Message...',
  rightButton: {
    color: '#536DFE',
    type: 'text', // or 'fontawesome' or 'ionicon', default 'text'
    value: 'Send', // 'fa-battery-quarter', // '\uf2c3', // 'Send', // default 'Send'
    textStyle: 'bold',
  },
});


/*window.NativeKeyboard.showMessengerKeyboard(function(){}, function(){});*/
if (this.state.isLoading || !this.state.merchantName) {
  return <Loading />;
}

    return (

      <div className="chat" style={styles.container}>
            
        <div style={styles.chat} className="full-chat">
        {/* Make this into a link ultimately when routing method is decided on */}
        <div className="linkback" onClick={this.goBack}><div className="triangle"></div>
        <div className="chatlinktitle">{this.state.merchantName}</div>
        </div>

          <GiftedChat user={{id: 1,}}
                      messages={this.state.messages}
                      onSend={this.onSend}
renderInputToolbar={this.renderFakeInputToolbar}
renderMessage={this.renderMessage}
style={{alignItems: "flex-start"}}
isAnimated={true}
className="gift-chat-start"
                      />
                      </div>
          </div>
    );
  }
}
const styles = {
  container: {
    display:'flex',
    height: '80vh',
    width: '95%',
    margin: '0 auto',
    overflow: "hidden",
    flexDirection: "row"
 
  },
  conversationList: {
    display:'flex',
    flex: 1,
  },
  chat: {

  },
  conversationDetails: {
    display:'flex',
    flex: 1,
  }
  
}

export default withKeycloak(Chat);