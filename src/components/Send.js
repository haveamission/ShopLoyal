import PropTypes from 'prop-types'
import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes,
  ViewStyle,
  TextStyle,
} from 'react-native'
import Color from './Color'

export default function Send({
  text,
  containerStyle,
  onSend,
  children,
  textStyle,
  label,
  alwaysShowSend,
  disabled,
}) {
  if (alwaysShowSend || (text && text.trim().length > 0)) {
    return (
      <TouchableOpacity
        testID='send'
        accessible
        accessibilityLabel='send'
        style={[styles.container, containerStyle]}
        onPress={() => {
          if (text && onSend) {
            onSend({ text: text.trim() }, true)
          }
        }}
        accessibilityTraits='button'
        disabled={disabled}
      >
        <View>
          {children || <Text style={[styles.text, textStyle]}>{label}</Text>}
        </View>
      </TouchableOpacity>
    )
  }
  return <View />
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'flex-end',
    position: "absolute",
    bottom: 0,
  },
  text: {
    color: Color.defaultPurple,
    fontWeight: '600',
    fontSize: '1.5em',
    zIndex: "100",
    backgroundColor: Color.backgroundTransparent,
    textAlign: "right",
marginBottom: '.5em',
    marginLeft: 10,
    marginRight: 10,
  },
})

Send.defaultProps = {
  text: '',
  onSend: () => {},
  label: 'Send',
  containerStyle: {},
  textStyle: {},
  children: null,
  alwaysShowSend: true,
  disabled: false,
}

Send.propTypes = {
  text: PropTypes.string,
  onSend: PropTypes.func,
  label: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  textStyle: PropTypes.any,
  children: PropTypes.element,
  alwaysShowSend: PropTypes.bool,
  disabled: PropTypes.bool,
}