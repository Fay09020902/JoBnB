import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';

import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  console.log("session user: ", sessionUser)

  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li>
          <NavLink exact to="/">Home</NavLink>
        </li>
        {isLoaded && (
          <li>
            {sessionUser && <NavLink to='/spots/new'>CreateSpotForm</NavLink>}
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
