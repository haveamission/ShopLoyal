import React, { Component } from "react";
import { Link } from "react-router-dom";

class NotifBubble extends Component {
  constructor(props) {
    super(props);

    const pathname =
      props.merchant.id === 0 ? "#" : `/chat/${props.merchant.id}`;

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
