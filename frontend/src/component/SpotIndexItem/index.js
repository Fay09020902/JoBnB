// import { useEffect } from 'react';
// import { useDispatch, useSelector} from "react-redux";
import { NavLink} from 'react-router-dom';
import EditSpotForm from '../EditSpotForm'
import ConfirmSpotDeleteModal from '../ConfirmSpotDeleteModal'
import './SpotIndexItem.css'
import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
//import { createSpotsThunk, loadSpots } from '../../store/spots';



function SpotIndexItem({spot, isOwner}) {

    console.log("spotidexItem runs")
    console.log("spot:", spot);
    const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef(null);

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



    return spot ? (
      <>
         <NavLink to={`/spots/${spot.id}`} className="spot-detail-link">
                <div className="spot-tile">
                    <div className="spot-name">{spot.name}</div>
                    <img
                        className="spot-entry-image"
                        alt={spot.imageUrl}
                        src={`${spot.previewImage}`}
                    />
                    <div className="spot-item">
                        <div>{spot.city}, {spot.state}</div>
                        <div className="rating">{spot.avgRating ? spot.avgRating : "New"}</div>
                    </div>
                    <div>{`$${spot.price}night`}</div>
                </div>
            </NavLink>
            {isOwner &&
              <div className="buttons-container">
             <NavLink to={`/spots/${spot.id}/edit`}>
              Update
            </NavLink>
              <OpenModalMenuItem
              itemText="Delete"
              onItemClick={closeMenu}
              modalComponent={  <ConfirmSpotDeleteModal spot = {spot}/>}
              />
            </div>}
      </>
    ): null;
}

export default SpotIndexItem;
