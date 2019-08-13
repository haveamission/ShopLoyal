import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Back from './Back'

class Support extends React.Component {
    render() {
        return (
            <div>
                <div className="settings">
                    <i onClick={() => this.props.onSetOpen(false)} className="fas fa-times large"></i>
                    <div className="sb-header">DOCS</div>
                    <ul className="main-settings">
                        {/*<li><span className="setting-left">Email</span> <span className="setting-right">contact@shoployal.com</span></li>*/}
                        <Link to="/terms/"><li className="list-bottom setting-left">Terms of Service</li></Link>
                        <Link to="/privacy/"><li className="list-bottom setting-left">Privacy Policy</li></Link>

                    </ul>
                </div>
            </div>
        )
    }
}

export default Support;