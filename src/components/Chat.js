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

const loremIpsum ='Lorem ipsum dolor sit amet, consectetur adipiscing elit';


const messages = [];
messages.push(generateMessage('Test Message 2', 3,  {}));
messages.push(generateMessage('Test Message 1', 2, {}));
messages.push(generateMessage('This is a great example of system message', 2, {system: true}));

for (let i = 0; i < 3; i++) {
  messages.push(generateMessage(loremIpsum.substring(0,(Math.random() * 100000)%loremIpsum.length), i))
}

function generateMessage(text, index, additionalData) {
  return {
    id: Math.round(Math.random() * 1000000),
    text: text,
    createdAt: new Date(),
    user: {
      id: index % 3 === 0 ? 1 : 2,
      name: 'Johniak',
    },
    ...additionalData,
  }
}

class Chat extends Component {
  constructor() {
    super()
    this.state = {
      messages: messages
    }
    this.onSend = this.onSend.bind(this)
  }

  renderLoading() {
    return (<div>Loading...</div>)
  }

  onSend(messages) {
    for(let message of messages){
      this.setState({messages: [message,...this.state.messages]})
    }
  }
  
  componentDidMount() {
  
  axios.post(API.localBaseUrlString + API.favoriteMerchantAPI, {"merchantId": this.state.merchant.id, "status": !this.state.merchant.isFavorite}, config).then(
        response => this.configuration(response.data)
      ).catch(function(error) {
        console.log(error);
      })
  
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

  render() {
    return (
<Page>
      <div className="chat" style={styles.container}>
            
        <div style={styles.chat} className="full-chat">
        {/* Make this into a link ultimately when routing method is decided on */}
        <div className="chatlinkback"><div className="triangle"></div><div className="chatlinktitle">Adventures in Toys</div></div>
          <GiftedChat user={{id: 1,}}
                      messages={this.state.messages}
                      onSend={this.onSend}
renderInputToolbar={this.renderInputToolbar}
renderMessage={this.renderMessage}
style={{alignItems: "flex-start"}}
className="gift-chat-start"
                      />
          </div>
      </div>
      </Page>
    );
  }
}
const styles = {
  container: {
    display:'flex',
    height: '80vh',
    width: '95%',
    margin: '0 auto'
  },
  conversationList: {
    display:'flex',
    flex: 1,
  },
  chat: {
    display:'flex',
    flex: 3,
    /*backgroundImage: `url(${Background})`*/
  },
  converationDetails: {
    display:'flex',
    flex: 1,
  }
  
}

export default Chat;