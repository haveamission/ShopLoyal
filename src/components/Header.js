import React from 'react'
import { Link } from 'react-router-dom'
import ShopLoyalImg from '../img/ShopLoyal.png'
import ProfileImg from '../img/profile.png'
import { Glyphicon } from 'react-bootstrap'
import Search from './Search'
import Categories from './Categories'

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
  <header>
    <nav>
      <img className="logo" src={ShopLoyalImg} />
      {/*<img className="profile" src={ProfileImg} />*/}
    </nav>
    <Search />
    <hr className="hr-header" />
    <Categories />
  </header>
)

export default Header
