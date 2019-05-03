import React, { Component } from 'react';
import FakeLogo from "../img/fake_test_logo.png";
import Favorite from "../img/full_heart.png";
import Background from "../img/fake_background_card.png";
import Message from "../img/message.png";
import Call from "../img/call.png";
import Map from "../img/map.png";
import ScrollMenu from 'react-horizontal-scrolling-menu';
import Card, {Swatch} from "./Card";
import PromoCard from "./PromoCard";
import withFetching from "./API";

const noticeAPI = 'http://localhost:3000/notice?count=3';
const merchantAPI = 'http://localhost:3000/merchants?count=3';

/*const list = [
    <Card />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
    <PromoCard />,
]*/

const promoIter = ({ data, isLoading, error }) => {
console.log("test");
return null;
}


function rnd(min,max){
    return Math.floor(Math.random()*(max-min+1)+min );
}
/*var i = 0;
for (i = 0; i < rnd(2, 4); i++) { 
list.push(<PromoCard />);
}*/

//const XYZ = withFetching(noticeAPI)(promoIter)

const XYZ = "XYZ";
export { XYZ };
   
  class CardRow extends Component {
    constructor() {
      super();
      //console.log("constructor works");
      //console.log(withFetching);
      //console.log(noticeAPI);
      //console.log(promoIter);
    const test = withFetching(noticeAPI)(promoIter);
    //console.log("BEFORE TEST");
    //console.log(test);
}

list = []

componentWillMount() {
  console.log("will mount");
  const test = withFetching(noticeAPI)(promoIter);
  this.setState({testval: test})
  console.log(this.props.merchant);
  this.list.push(<Card merchant={this.props.merchant} />)
}

componentDidMount() {
  console.log("did mount");
  console.log(this.props.merchant);
}
    render() {
   
      return (
        <div className="App">
                <Swatch merchant={this.props.merchant}/>
          <ScrollMenu
            data={this.list}
          />
        </div>
      );
    }
  }

  export default CardRow;