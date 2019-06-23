import Header from './Header'
import React, {Component} from 'react'
import LoginPage from './LoginPage'
import Dummy from './Dummy'

class Layout extends Component {

    render() {
        return (
            <div>
                <Header />
                {this.props.children}
            </div>
        )
    }
}
  
  export default Layout