import React, { Component } from 'react';
import FakeLogo from "../img/fake_test_logo.png";
import Favorite from "../img/full_heart.png";
import Background from "../img/fake_background_card.png";
import Message from "../img/message.png";
import Call from "../img/call.png";
import Map from "../img/map.png";
import CardRow, {XYZ} from "./CardRow";
import Page from './Page'

const merchantAPI = 'http://localhost:3000/merchants?count=3';

// Insert API call here?

class Cards extends Component {
    state = {
        data: []
      }
    

    componentDidMount() {
        fetch(merchantAPI)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong ...');
          }
        })
        .then(
          data => this.setState({ data, isLoading: false }
          )
        )
        }

        if (error) {
            return <p>{error.message}</p>;
          }
        
          if (isLoading) {
            return <p>Loading ...</p>;
          }


        render() {
            return (
    <Page>
    <div>
    {this.state.data.map( merchant =>
     <CardRow 
     merchant={{merchant}}
      />
  )}
    </div>
    </Page>
);
        }
    }

export default Cards;
