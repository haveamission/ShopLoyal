import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Bubble} from 'react-web-gifted-chat'
import {
    View,
    ViewPropTypes,
    StyleSheet,
  } from 'react-native';
  import Color from './Color'
  import TouchableOpacity from './TouchableOpacity';
    
    export default class SLBubble extends Bubble {
        constructor(props){
            super(props);
        }
        render() {
            return (
              <View style={[styles[this.props.position].container, this.props.containerStyle[this.props.position]]}>
                <View
                  style={[
                    styles[this.props.position].wrapper,
                    this.props.wrapperStyle[this.props.position],
                    super.handleBubbleToNext(),
                    super.handleBubbleToPrevious(),
                  ]}
                >
                  <TouchableOpacity
                    withoutFeedback
                    onLongPress={this.onLongPress}
                    accessibilityTraits="text"
                    {...this.props.touchableProps}
                  >
                    <View>
                      {super.renderCustomView()}
                      {super.renderMessageImage()}
                      {super.renderMessageVideo()}
                      {super.renderMessageText()}
                      <View style={[styles[this.props.position].bottom, this.props.bottomContainerStyle[this.props.position]]}>
                        {super.renderUsername()}
                        {/*super.renderTime()*/}
                        {super.renderTicks()}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }
    };

    const styles = {
        left: StyleSheet.create({
          container: {
            flex: 1,
            alignItems: 'flex-start',
          },
          wrapper: {
            borderRadius: 15,
            backgroundColor: Color.defaultColor,
            marginRight: 60,
            minHeight: 20,
            maxWidth: "50em",
            justifyContent: 'flex-end',
          },
          containerToNext: {
            borderBottomLeftRadius: 3,
          },
          containerToPrevious: {
            borderTopLeftRadius: 3,
          },
          bottom: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
          },
        }),
        right: StyleSheet.create({
          container: {
            flex: 1,
            alignItems: 'flex-end',
          },
          wrapper: {
            borderRadius: 15,
            backgroundColor: Color.defaultPurple,
            marginLeft: 60,
            minHeight: 20,
            maxWidth: "50em",
            justifyContent: 'flex-end',
          },
          containerToNext: {
            borderBottomRightRadius: 3,
          },
          containerToPrevious: {
            borderTopRightRadius: 3,
          },
          bottom: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
          },
        }),
        tick: {
          fontSize: 10,
          backgroundColor: Color.backgroundTransparent,
          color: Color.white,
        },
        tickView: {
          flexDirection: 'row',
          marginRight: 10,
        },
        username: {
          top: -3,
          left: 0,
          fontSize: 12,
          backgroundColor: 'transparent',
          color: '#aaa',
        },
        usernameView: {
          flexDirection: 'row',
          marginHorizontal: 10,
        },
      };