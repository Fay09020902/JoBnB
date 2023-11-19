// import { useEffect } from 'react';
// import { useDispatch, useSelector} from "react-redux";
import { NavLink} from 'react-router-dom';
import ConfirmSpotDeleteModal from '../ConfirmSpotDeleteModal'
import './SpotIndexItem.css'
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
//import { createSpotsThunk, loadSpots } from '../../store/spots';



function SpotIndexItem({spotId, isOwner, ifSession}) {

    //console.log("spotidexItem runs")
    const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef(null);
  const spotstate = useSelector(state => state.spots[spotId]);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) { // Check if ulRef.current exists
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);



    return spotstate ? (
      <div className='spotIndexContainer'>
         <NavLink to={`/spots/${spotstate.id}`} className="spot-detail-link">
          {console.log("spot in spot index item: ", spotstate)}
                <div className="spot-tile">
                    <div className="spot-name">{spotstate.name}</div>
                    <img
                        className="spot-entry-image"
                        alt={spotstate.imageUrl}
                        src={`${spotstate.previewImage}`}
                    />
                    <div className="spot-item">
                        <div className='location'>{spotstate.city}, {spotstate.state}</div>
                        <div>⭐{spotstate.avgRating ? spotstate.avgRating : "New"}</div>
                    </div>
                    <div className="price">{`$${spotstate.price}night`}</div>
                </div>
            </NavLink>
            {isOwner &&
              <div className="buttons-container">
                 <div className="updatemanage-button">
                    <NavLink to={`/spots/${spotstate.id}/edit`}>
                      Update
                    </NavLink>
                </div>
                <div className="deletemanage-button">
                    <OpenModalMenuItem
                    itemText="Delete"
                    onItemClick={closeMenu}
                    modalComponent={  <ConfirmSpotDeleteModal spot = {spotstate}/>}
                    />
                </div>
            </div>}
      </div>
    ): null;
}

export default SpotIndexItem;
