import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Message} from 'react-web-gifted-chat'
import {Avatar} from 'react-web-gifted-chat'
import {Day } from 'react-web-gifted-chat';
import { isSameUser, isSameDay } from './utils'
import SLBubble from './SLBubble';
import {
    View,
    ViewPropTypes,
    StyleSheet,
  } from 'react-native';
  import PropTypes from 'prop-types';

    export default class ChatMessage extends Message {
        constructor(props){
            super(props);
        }

        renderBubble() {
            const bubbleProps = this.getInnerComponentProps();
            if (this.props.renderBubble) {
              return this.props.renderBubble(bubbleProps);
            }
            return <SLBubble {...bubbleProps} />;
          }

          renderAvatar() {
            let extraStyle;
            if (
              isSameUser(this.props.currentMessage, this.props.previousMessage)
              && isSameDay(this.props.currentMessage, this.props.previousMessage)
            ) {
              // Set the invisible avatar height to 0, but keep the width, padding, etc.
              extraStyle = { height: 0 };
            }
        
            const avatarProps = this.getInnerComponentProps();
            return (
              <Avatar
                {...avatarProps}
                imageStyle={{ left: [styles.slackAvatar, avatarProps.imageStyle, extraStyle] }}
              />
            );
          }

          render() {
            const marginBottom = isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10;
        
            return (
              <View>
                {super.renderDay()}
                <View
                  style={[
                    styles.container,
                    { marginBottom },
                    this.props.containerStyle,
                  ]}
                >
                  {this.renderAvatar()}
                  {this.renderBubble()}
                </View>
              </View>
            );
          }
    };

    const styles = StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          marginLeft: 8,
          marginRight: 0,
        },
      });

      ChatMessage.defaultProps = {
        renderAvatar: undefined,
        renderBubble: null,
        renderDay: null,
        currentMessage: {},
        nextMessage: {},
        previousMessage: {},
        user: {},
        containerStyle: {},
      };
      
      ChatMessage.propTypes = {
        renderAvatar: PropTypes.func,
        renderBubble: PropTypes.func,
        renderDay: PropTypes.func,
        currentMessage: PropTypes.object,
        nextMessage: PropTypes.object,
        previousMessage: PropTypes.object,
        user: PropTypes.object,
        containerStyle: PropTypes.shape({
          left: ViewPropTypes.style,
          right: ViewPropTypes.style,
        }),
      };