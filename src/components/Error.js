import React, { Component } from 'react';
import Page from './Page'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

class Error extends Component {
    render() {
                return (
            <Page>
            <div className="error">
            <div>Error logging in</div>
            <Link to="/login/"><div className="bottomtext">Login</div></Link>
            </div>
            </Page>
        )
            }
}

export default Error