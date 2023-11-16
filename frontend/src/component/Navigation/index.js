import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import Logo from "../../../src/images/flowericon.png"

import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li className='logo-li'>
        <img src={Logo} alt="Logo" className="logo" />
          <NavLink exact to="/">JoBnB</NavLink>
        </li>
        {isLoaded && (
          <li className='profile'>
            {sessionUser && <NavLink to='/spots/new' className='create-spot-form-link'>CreateSpotForm</NavLink>}
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
