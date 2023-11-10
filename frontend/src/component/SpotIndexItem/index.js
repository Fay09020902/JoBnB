// import { useEffect } from 'react';
// import { useDispatch, useSelector} from "react-redux";
import { NavLink} from 'react-router-dom';
import EditSpotForm from '../EditSpotForm'
import './SpotIndexItem.css'
//import { createSpotsThunk, loadSpots } from '../../store/spots';



function SpotIndexItem({spot, isOwner}) {

    console.log("spotidexItem runs")
    console.log("spot:", spot);
    return spot ? (
         <NavLink to={`/spots/${spot.id}`} className="spot-detail-link">
                <div className="spot-tile">
                    <div className="spot-name">{spot.name}</div>
                    <img
                        className="spot-entry-image"
                        src={`${spot.previewImage}`}
                    />
                    <div className="spot-item">
                        <div>{spot.city}, {spot.state}</div>
                        <div className="rating">{spot.avgRating ? spot.avgRating : "New"}</div>
                    </div>
                    <div>{`$${spot.price}night`}</div>
                    {isOwner &&
                        <div className="buttons-container">
                       <NavLink to={`/spots/${spot.id}/edit`}>
                        Update
                      </NavLink>
                      </div>}
                </div>
            </NavLink>
    ): null;
}

export default SpotIndexItem;
