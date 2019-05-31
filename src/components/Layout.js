import Header from './Header'
import SL_Footer from './Footer'
import React, {Component} from 'react'
import { connect } from 'react-redux'

class Layout extends Component {

    componentDidMount() {
        console.log("LAYOUT STATE AND PROPS");
        console.log(this.props);
        console.log(this.state);
    }
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

const mapStateToProps = (state) => {
    return {
      //general: state.general,
      oidc: state.oidc,
    };
  };
  
  /*function mapDispatchToProps(dispatch) {
    //return bindActionCreators({saveColor}, dispatch);
    let actions = bindActionCreators({ saveColor }, dispatch);
    return { ...actions, dispatch };
  }*/
  
  export default connect(mapStateToProps)(Layout)