import React from 'react';
import {
  StyleSheet,
  View,
  ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';

import Composer from './Composer';
import Send from './Send';
import Actions from './Actions';

const styles = StyleSheet.create({
  container: {


  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: "5em",
borderColor: '#C7C7CC',
borderWidth: '1px',
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#FFF',
    width: '80%',
    margin: "0 auto",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: "50px",
    height: "4em",


  },
  accessory: {
    height: 44,
  },
});

export default class InputToolbar extends React.Component {
  renderActions() {
    const { renderActions, onPressActionButton } = this.props;

    if (renderActions) {
      return renderActions(this.props);
    } else if (onPressActionButton) {
      return <Actions {...this.props} />;
    }
    return null;
  }

  renderSend() {
    const { renderSend } = this.props;

    if (renderSend) {
      return renderSend(this.props);
    }
    return <Send {...this.props} />;
  }

  renderComposer() {
    /*const { renderComposer } = this.props;

    if (renderComposer) {
      return renderComposer(this.props);
    }*/

    return (
      <Composer
        {...this.props}
      />
    );
  }

  renderAccessory() {
    const { renderAccessory, accessoryStyle } = this.props;

    if (renderAccessory) {
      return (
        <View style={[styles.accessory, accessoryStyle]}>
          {renderAccessory(this.props)}
        </View>
      );
    }
    return null;
  }

  render() {
    const { containerStyle, primaryStyle } = this.props;

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.primary, primaryStyle]}>
          {this.renderActions()}
          {this.renderComposer()}
          {this.renderSend()}
        </View>
        {this.renderAccessory()}
      </View>
    );
  }
}


InputToolbar.defaultProps = {
  renderAccessory: null,
  renderActions: null,
  renderSend: null,
  renderComposer: null,
  onPressActionButton: null,
  containerStyle: {},
  primaryStyle: {},
  accessoryStyle: {},
};

InputToolbar.propTypes = {
  renderAccessory: PropTypes.func,
  renderActions: PropTypes.func,
  renderSend: PropTypes.func,
  renderComposer: PropTypes.func,
  onPressActionButton: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  primaryStyle: ViewPropTypes.style,
  accessoryStyle: ViewPropTypes.style,
};