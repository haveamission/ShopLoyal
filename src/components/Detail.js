import React from "react";
import Card from "./Card";

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

const Detail = () => (
    <div className="detail">
    <i class="ico-times"></i>
    <Card />
    <About />
    <Promotions />
    </div>
);

export default Detail;