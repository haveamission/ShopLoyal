import React, {Component} from 'react';
import {GiftedChat, Bubble} from 'react-web-gifted-chat';
import Background from "../img/fake_background_card.png";
//import { GiftedChat } from 'react-native-gifted-chat';
import Page from './Page'
import Bubble2 from './Card'

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

  render() {
    return (
<Page>
      <div className="chat" style={styles.container}>
            
        <div style={styles.chat}>
        {/* Make this into a link ultimately when routing method is decided on */}
        <div className="chatlinkback"><div className="triangle"></div><div className="chatlinktitle">Adventures in Toys</div></div>
          <GiftedChat user={{id: 1,}}
                      messages={this.state.messages}
                      onSend={this.onSend}
                      renderBubble={<Bubble2 />}
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
    flexDirection: 'row',
    height: '100vh'
  },
  conversationList: {
    display:'flex',
    flex: 1,
  },
  chat: {
    display:'flex',
    flex: 3,
    borderWidth: '1px',
    borderColor: '#ccc',
    borderStyle: 'solid',
    /*backgroundImage: `url(${Background})`*/
  },
  converationDetails: {
    display:'flex',
    flex: 1,
  }
  
}

export default Chat;