import React, { Component } from 'react';
import Iframe from 'react-iframe'

export default (props) => (
    <Iframe url={props.url}
    width="100%"
    height="1000em"
    id="support"
    className="webpage"
    display="initial"
    frameBorder="0"
    overflow="hidden"
    scrolling="no"
    />
);