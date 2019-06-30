import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './chat.css';
import Loading from './Loading'
import axios from 'axios'
import API from './API'
import {bindActionCreators} from 'redux'
import { withKeycloak } from 'react-keycloak';
import TextareaAutosize from 'react-autosize-textarea';
const format = require('string-format')

const messages = [];

function generateMessage(message, index, additionalData) {
  if(message.recipient == 'merchant') {
var idval = 1;
var position = "right";
  }
  else if(message.recipient == 'customer') {
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
    ...additionalData,
  }
}

class Chat extends Component {
  constructor() {
    super()
    this.state = {
      messages: [{}],
      merchant: {"id": null},
      isLoading: true,
      text: "",
      keyboardVal: 0,
    }
    this.goBack = this.goBack.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  messagesEndRef = React.createRef();

  componentWillMount(){
    document.body.style.position = "fixed";
}

componentWillUnmount(){
    document.body.style.position = "static";
    this.setState({"merchantName": this.props.location.state.merchant.name});
    clearInterval(this.interval);
}

  openChannel() {
    var api = new API(this.props.keycloak);
    //alert(this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1));
    var merchant_id = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);
    api.post("openChannel", {"repl_str": merchant_id}).then(
      response => console.log(JSON.stringify(response.data))
      ).catch(function(error) {
      console.log(error);
      })
  }


      loadChannels(data) {
        this.createChannel(data.userId);
          }
        
          loadMessages(data) {
            console.log("loaded messages");
        console.log(data);
        
        var count = 0;
        
        var messagevals = [];
        
        data.reverse().forEach(function(obj) {
        console.log(obj.message);
        messagevals.push(generateMessage(obj, count, {}));
        count++;
        });
        
        console.log(messagevals);
        
        this.setState({messages: messagevals});
        
        this.setState({isLoading: false});
        
        console.log(data.map(obj => obj.message));
        
          }

          pullMessages() {
            var api = new API(this.props.keycloak);
            var merchant_id = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);
            api.get("merchantMessages", {"repl_str": merchant_id}).then(
              response => this.loadMessages(response.data)
              ).catch(function(error) {
              console.log(error);
              })
          }

          pullChannels() {
            var api = new API(this.props.keycloak);
            api.get("channels").then(
              response => this.loadChannels(response.data)
              ).catch(function(error) {
              console.log(error);
              })
          }

          createChannel(userId) {
            var api = new API(this.props.keycloak);
            api.post("channel", {"repl_str": userId}).then(
              response => console.log(response.data)
              ).catch(function(error) {
              console.log(error);
              })
          }    
        
          componentDidMount() {
            this.openChannel();
           
          console.log(this.state);
          console.log("chat props");
          console.log(this.props);

          this.pullMessages();
          this.interval = setInterval(() => this.updateMessages(), 25000);
          //this.scrollToBottom();
          }

          updateMessages() {
console.log("update messages");
this.pullMessages();
this.scrollToBottom();
          }

          onSend() {
            if(this.state.text !== null || this.state.text !== "") {
              

              var messages = [this.state.text];
              this.setState({text: ""});
            this.openChannel();
            //alert(this.props.profile.id);
            var userId = this.props.profile.id;
            this.createChannel(userId)
            for(let message of messages){
              console.log(message);
              this.saveMessage(message);
              var messageHydrated = this.addMessageInfo(message);
              this.setState({messages: [...this.state.messages, messageHydrated]})
            }
            this.scrollToBottom();
          }
          }
        
          addMessageInfo(message) {
        return {
          text: message,
          position: "right"
        }
          }

          saveMessage(message) {
            var body = {
              "message": message
            }

            var api = new API(this.props.keycloak);
        
        var merchant_id = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);
        api.post("merchantSendMessage", {"body": body, "repl_str": merchant_id}).then(
          response => console.log(response.data)
          ).catch(function(error) {
          console.log(error);
          })
          }

          goBack() {
            this.props.history.goBack();
          }

          chatClicked = (props) => {
            if(window.Keyboard) {
            window.Keyboard.hide();
            }
          };

          handleChange(event) {
            this.setState({
              text: event.target.value
            });
          }

          scrollToBottom = () => {
            this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          }

    render() {

      //var keyboardStyle = {transform: 'translate3d(0px, ' + this.state.keyboardVal + 'px, 0px)'}

        if(this.state.isLoading) {

        return (<Loading />)
        }
        else {
                return (
                  <div>
                  <div id="messages-container" onClick={() => this.chatClicked()} style={{transform: 'translate3d(0,0,0)'}}>
                      <div id="messages">
                      {this.state.messages.map( (message, index) =>
                          <div className={"message " + message.position}>
                          <span>{message.text}</span>
                          </div>
                      )}
                      </div>
                      <div style={{ float:"left", clear: "both", height: '6rem' }}
                         ref={this.messagesEndRef}>
                      </div>
                  </div>
          
                  <div /*onClick={() => {this.myChat.focus()}}*/ className="msginput">
                  <div className="inner-keyboard">
                      <TextareaAutosize
                            //ref={(ic) => this.myChat = ic}
                            value={this.state.text}
                            onChange={evt => this.handleChange(evt)}
                            maxRows={2}
                            placeholder="Message..."
                            className="textareainput"
                            onResize={(e) => {}}
                            name="msginput"
                      />
                      <div onClick={this.onSend} className="sendbutton">SEND</div>
                      </div>
                  </div>
            </div>

                )
            }
      }
    }

      const mapStateToProps = (state) => {
        return {
          profile: state.profile,
        };
      };

export default connect(mapStateToProps)(withKeycloak(Chat));