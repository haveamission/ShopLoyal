import React from 'react';
import {Link} from 'react-router-dom'
import {Navbar, NavItem} from 'react-materialize';

export default React.createClass({
  render(){
    return (
    <div>
      <Navbar brand='logo' right>
        <NavItem><Link to="/Home" activeClassName="active">Home</Link></NavItem>
        <NavItem><Link to="/Sign-In" activeClassName="active">Sign In</Link></NavItem>
        <NavItem><Link to="/Register" activeClassName="active">Register</Link></NavItem>
      </Navbar>
      {this.props.children}
    </div>
    )
  }
})