import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class NotifBubble extends Component {

    componentDidMount() {
        //console.log("Bubble mount");
        //console.log(this.props);
        this.pathname = "/chat/" + this.props.merchant.id
        if(this.props.merchant.id === 0) {
            this.pathname = '#';
        }
        
    }

    render() {
        return(
    <Link className="notif-bubble-link" to={{
        pathname: this.pathname,
        state: {merchant: this.props.merchant}
    }}><div className="notif-bubble slide-in-right">
        {this.props.message}
</div></Link>
);
    }
}

export default NotifBubble;