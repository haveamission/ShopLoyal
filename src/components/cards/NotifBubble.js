import React, { Component } from "react";
import { Link } from "react-router-dom";

/**
 * This is the notification bubble component
 */
class NotifBubble extends Component {
  constructor(props) {
    super(props);

    /**
     * Probably should refactor to be simpler, but need to have notification bubble example up to test
     */

    const pathname =
      props.merchant.id === `/chat/${props.merchant.id}`;

    this.state = {
      pathname
    };
  }

  render() {
    if (typeof this.props.merchant === "undefined") {
      return <div> </div>;
    }
    return (
      <Link
        className="notif-bubble-link"
        to={{
          pathname: this.state.pathname,
          state: {
            merchant: this.props.merchant
          }
        }}
      >
        {" "}
        <div className="notif-bubble slide-left-notif">
          {" "}
          {this.props.message}{" "}
        </div>
      </Link>
    );
  }
}

export default NotifBubble;
