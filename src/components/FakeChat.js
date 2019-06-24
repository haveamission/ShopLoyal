import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import './fakechat.css';
import Loading from './Loading'
import axios from 'axios'
import API from './API'
import {bindActionCreators} from 'redux'
import { withKeycloak } from 'react-keycloak';
/*import NativeKeyboard from './NativeKeyboard'
import cordova from '../cordova'
window.cordova = cordova;*/
const format = require('string-format')

const messages = [];

function generateMessage(message, index, additionalData) {
  if(message.recipient == 'merchant') {
var idval = 1;
var position = "right";
  }
  else if(message.recipient == 'customer') {
var idval = 2;
var position = "left;"
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

class FakeChat extends Component {
  constructor() {
    super()
    this.state = {
      messages: [{}],
      merchant: {"id": null},
      isLoading: true,
    }
    this.goBack = this.goBack.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  openChannel() {
    var api = new API(this.props.keycloak);
    var merchant_id = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);
    api.post("openChannel", {"repl_str": merchant_id}).then(
      response => console.log(response.data)
      ).catch(function(error) {
      console.log(error);
      })
  }


      loadChannels(data) {
        this.createChannel(data.userId);
          }
        
          loadMessages(data) {
            alert(JSON.stringify(data));
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
          /*
          loadChannel(data) {
            console.log("messages");
            console.log(this.state);
          console.log(data);
          }
          */

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
          /*
          createChannel(userId) {
        
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
          response => alert(JSON.stringify(response.data))
          ).catch(function(error) {
          console.log(error);
          })
          }*/
        
          componentWillMount() {
            this.setState({"merchantName": this.props.location.state.merchant.name});
          }
        
          componentDidMount() {
            this.openChannel();
           
          console.log(this.state);
          console.log(this.props);

          this.pullMessages();
          
          }

          onSend(messages) {
            this.openChannel();
            // CHANGE WITH REAL VALUE
            var userId = "586";
            this.createChannel(userId)
            for(let message of messages){
              console.log(message);
              //alert(message);
              this.saveMessage(message);
              var messageHydrated = this.addMessageInfo(message);
              alert(JSON.stringify(messageHydrated));
              this.setState({messages: [...this.state.messages, messageHydrated]})
            }
          }
        
          addMessageInfo(message) {
        return {
          text: message,
          position: "right"
        }
          }

          saveMessageNew(message) {
            var body = {
              "message": message
            }

            var api = new API(this.props.keycloak);
        
        var merchant_id = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);
        api.post("merchantSendMessage", {"body": body}).then(
          response => alert(response.data)
          ).catch(function(error) {
          console.log(error);
          })
          }
/*
          saveMessage(message) {
            let config = {
              headers: {
                'Authorization': "Bearer " + this.props.keycloak.idToken,
              }
            }

            //alert(message);
        
            var body = {
              "message": message
            }
        
            console.log("chat url");
            console.log(API.prodBaseUrlString + format(API.merchantSendMessage, this.state.merchant.id));
        
        var merchant_id = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);
        alert(JSON.stringify(config));
        axios.post(API.prodBaseUrlString + format(API.merchantSendMessage, merchant_id), body, config).then(
        response => alert(JSON.stringify(response.data))
        ).catch(function(error) {
        console.log(error);
        //alert(error);
        })
          }*/

          goBack() {
            this.props.history.goBack();
          }

    render() {

        if(this.state.isLoading) {

        return (<Loading />)
        }
        else {
 // TODO: Figure out a way to emulate this.
          /*if(window.NativeKeyboard) {

          var that = this;

          window.NativeKeyboard.showMessenger({
            onSubmit: function(text) {
              that.onSend([text]);
              //alert("Show keyboard");
            },
            showKeyboard: true,
            autocorrectionEnabled: true,
            animated: true,
            placeholder: 'Message...',
            autoscrollElement: document.getElementById("messages"), // default unset
            scrollToBottomAfterMessengerShows: true,
            keepOpenAfterSubmit: true,
            rightButton: {
              color: '#536DFE',
              type: 'text', // or 'fontawesome' or 'ionicon', default 'text'
              value: 'SEND', // 'fa-battery-quarter', // '\uf2c3', // 'Send', // default 'Send'
              textStyle: 'bold',
            },
          });
        }*/

        //showMessenger();
        window.Keyboard.hideFormAccessoryBar(true);
                return (

                  <div>
                  
           <div id="messages-container">
           
<div id="messages">
<div class="message left"><span>Example merchant message</span>
  </div>
  <div class="message right"><span>Example customer message</span>
  </div>
  <div class="message right"><span>Test</span>
  </div>
  <div class="message right"><span>Test 2</span>
  </div>
{this.state.messages.map( (message, index) =>

  <div class={"message " + message.position}><span>{message.text}</span>
  {/*<div>Delivered</div>*/}
</div>
)}
                </div>

                
           
                </div>
                <input type="textarea" name="msginput" className="msginput" />
                </div>
                )
            }
        }
      }

export default withKeycloak(FakeChat);