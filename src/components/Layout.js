import Header from './Header'
import SL_Footer from './Footer'
import React, {Component} from 'react'
import LoginPage from './LoginPage'

class Layout extends Component {

    render() {
        return (
            <div>
                <Header />
                {this.props.children}
                {/*<SL_Footer />*/}
            </div>
        )
    }
}
  
  export default Layout