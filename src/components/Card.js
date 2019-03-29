import React from "react";
import FakeLogo from "../img/fake_test_logo.png";
import Favorite from "../img/full_heart_white.png";
import Background from "../img/fake_background_card.png";
import MessageText from "../img/message.png";
import Call from "../img/call.png";
import Map from "../img/map.png";

const Card = () => (
    <div className="card titlecard" style={{backgroundImage: `url(${Background})`}}>
    
    <div className="layer"></div>
    {/* Split off into another component */}
    <div className="bubble">Sample text Merchant Text</div>
      <div className="card-left">
        <div className="card-logo">
          <img className="card-logo-img" src={FakeLogo} />
        </div>
      </div>
      <div className="card-right">
        <img className="card-favorite" src={Favorite} />
        <div className="card-right-bottom">
          <h2 className="card-title">Adventures in Toys</h2>
          <div className="card-address">250 W. Maple Rd.</div>
          <hr />
          <div className="card-nav">
          <ul>
          <li>Message<img src={MessageText} /></li>
          <li>Call<img src={Call} /></li>
          <li>Map<img src={Map} /></li>
          </ul>
              </div>
        </div>
      </div>
    </div>
);

export default Card;