import { useEffect } from 'react';
import { useDispatch, useSelector} from "react-redux";
import { loadSpotsThunk } from '../../store/spots';
import SpotIndexItem from '../SpotIndexItem';

function SessionSpot() {
    console.log("session spot component runs")
    const dispatch = useDispatch();

    const allSpots = useSelector(state => state.spots)
    const user = useSelector(state => state.session.user)
    // Filter spots that belong to the authenticated user
    const userSpots = Object.values(allSpots).filter((spot) => spot.ownerId === user.id);


    if (!Object.values(userSpots).length) return <div>No Session Spots</div>;

    return (
        <div className="index">
            {Object.values(allSpots).map((spot) => (
                <div className="item" key={spot.id}>
                    <SpotIndexItem
                    spot={spot} isOwner={true}/>
                </div>
            ))}
        </div>
    )
}

export default SessionSpot;
