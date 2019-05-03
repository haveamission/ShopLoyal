import React, { Component } from "react";
import ReactDOM from "react-dom";
import Toggle from "react-bootstrap-toggle";
import Script from "react-load-script";
import $ from "jquery";
import * as voice from "../pandaistvoice.js";
var classNames = require("classnames");

export default class ControlForm extends Component {
  constructor() {
    super();
    this.state = {
      toggleActive: true,
      togglePinyin: true,
      sizeSelect: "0",
      speed: 1.3,
      volume: 0.6,
      sizeText: "small-font"
    };
    this.onToggle = this.onToggle.bind(this);
    this.onTogglePinyin = this.onTogglePinyin.bind(this);
    this.handleSpeedChange = this.handleSpeedChange.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
    this.handleSizeSelect = this.handleSizeSelect.bind(this);
    this.formSubmission = this.formSubmission.bind(this);
    this.translateNumericSize = this.translateNumericSize.bind(this);
    this.formSubmissionCallParent = this.formSubmissionCallParent.bind(this);
  }

formSubmission() {
    
this.setState({update: true}, this.formSubmissionCallParent);  
}

formSubmissionCallParent() {
    this.props.parentMethod(this.state);
}

  translateNumericSize(numeric) {
      var size = 'small';
      if(numeric == 0) {
          size = 'small-font';
      }
  else if(numeric == 1) {
      size = 'normal-font';
  }
  else if(numeric == 2) {
      size = 'large-font';
  }
  else if(numeric == 3) {
      size = 'xl-font';
  }
      return size;
  }

  onToggle() {
    this.setState({ toggleActive: !this.state.toggleActive }, this.formSubmission);
  }
    onTogglePinyin() {
    this.setState({ togglePinyin: !this.state.togglePinyin }, this.formSubmission);
  }

  handleSizeSelect(event) {
      console.log("size select");
  console.log(event.target.value);
    var sizeText = this.translateNumericSize(event.target.value);
    this.setState({ sizeText: sizeText, 'sizeSelect': event.target.value}, this.formSubmission);
  }
  


  handlePlayClick(e) {
    e.preventDefault();
    voice.playButtonClick();
  }
  handlePauseClick(e) {
    e.preventDefault();
    voice.pauseButtonClick();
  }
  handleStopClick(e) {
    e.preventDefault();
    voice.stopButtonClick();
  }
  handleVolumeChange(event) {
    this.setState({ volume: event.target.value }, this.formSubmission);
  }
  handleSpeedChange(event) {
    this.setState({ speed: event.target.value }, this.formSubmission);
  }

  render() {
    return (
      <div>
        <form>
          <div id="style" className="style">
            <Toggle
              onClick={this.onToggle}
              on={<label>Simplified</label>}
              off={<label>Traditional</label>}
              size="xs"
              offstyle="default"
              width={75}
              offClassName="btn-unselected"
              active={this.state.toggleActive}
              className="toggle-top"
            />
                        <Toggle
              onClick={this.onTogglePinyin}
              on={<label>Pinyin</label>}
              off={<label>No Pinyin</label>}
              size="xs"
              offstyle="default"
              width={75}
              offClassName="btn-unselected"
              active={this.state.togglePinyin}
              className="pinyin-toggle"
            />
            <div className="form-item form-type-select form-group">
              <label className="control-label">Font Size</label>
              <select
                value={this.state.value}
                onChange={this.handleSizeSelect}
                id="font-size"
                className="form-control form-select"
              >
                <option value="0">Small</option>
                <option value="1">Normal</option>
                <option value="2">Large</option>
                <option value="3">XL</option>
              </select>
            </div>
          </div>
          <div id="controls">
            <button id="play-button" onClick={this.handlePlayClick}>
              Play
            </button>
            <button id="pause-button" onClick={this.handlePauseClick}>
              Pause
            </button>
            <button id="stop-button" onClick={this.handleStopClick}>
              Stop
            </button>
          </div>
          <div id="dials">
            <div id="speed-dial" className="dial">
              <label htmlFor="speed">Speed</label>
              <input
                id="speed"
                type="range"
                min=".5"
                max="2"
                step=".1"
                value={this.state.speed}
                onChange={this.handleSpeedChange}
              />
            </div>
            <div id="volume-dial" className="dial">
              <label htmlFor="volume">Volume</label>
              <input
                id="volume"
                type="range"
                min="0"
                max="10"
                step=".1"
                value={this.state.volume}
                onChange={this.handleVolumeChange}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
