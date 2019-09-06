import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Error extends Component {
    render() {
        return (
            <div className="error">
                <div>Error logging in</div>
                <Link to="/login/"><div className="bottomtext">Login</div></Link>
            </div>
        )
    }
}

export default Error