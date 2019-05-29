import React, { Component } from 'react';
import Card from "./Card";
import Page from './Page'
import { connect } from 'react-redux'

const About = () => (
    
<div className="about">
<h3>About</h3>
<p>Our selection of toys is one of the largest in the Metro Detroit area. In our store, you can find all your kid's favorites. We are always up-to-date with the latest and greatest toys that they're sure to love.</p>
</div>
);

const Promotions = () => (
<div className="promotions">
<h3>Promotions</h3>
</div>
);

class Detail extends Component {

    state = {
        data: {
        },
      }

      goBack() {
        this.props.history.goBack();
      }

      componentWillMount() {
        var merchant_id = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);
        console.log(merchant_id);
        
        var merchantAPIDetail = 'http://localhost:3000/merchants/' + merchant_id;
        fetch(merchantAPIDetail)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong ...');
          }
        })
        .then(
          data => this.setState({ data, isLoading: false }, () => console.log(this.state))
        )
        }

        if (error) {
            return <p>{error.message}</p>;
          }
        
          if (isLoading) {
            return <p>Loading ...</p>;
          }

    render() {
console.log(this.state.data);
        if (Object.keys(this.state.data).length == 0) {
            return <div />
        }
        console.log("not empty");
        console.log(this.state.data);
   
        return (
    <Page>
    <div className="detail">
    <i onClick={this.goBack} className="ico-times"></i>
    <Card merchant={this.state.data}/>
    <About />
    <Promotions />
    </div>
    </Page>
)
    }
}

const mapStateToProps = (state) => {
  return {
    oidc: state.oidc,
  };
};

export default  connect(mapStateToProps, null)(Detail);