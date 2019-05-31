import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class NotifBubble extends Component {

    componentDidMount() {
        console.log("Bubble mount");
        console.log(this.props);
    }

    render() {
        return(
    <Link to={{
        pathname: "/chat/" + this.props.merchant.id,
        state: {merchant: this.props.merchant}
    }}><div className="notif-bubble">
        {this.props.message}
</div></Link>
);
    }
}

export default NotifBubble;