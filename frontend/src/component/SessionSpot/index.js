import { useEffect, useState } from 'react';
import { useDispatch, useSelector} from "react-redux";
import { loadSessionSpotsThunk } from '../../store/spots';
import SpotIndexItem from '../SpotIndexItem';
import { useHistory } from "react-router-dom";

function SessionSpot() {
    //.log("session spot component runs")
    const dispatch = useDispatch();
    const history = useHistory();
    //const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        console.log("useeffect for sessionspot runs")
        const fetchData = async () => {
            try {
                const detailedspots = await dispatch(loadSessionSpotsThunk(user.id));
            } catch (error) {
                const data = await error.json();
                //console.error('Error fetching data:', data);
            }
        };
        fetchData();
    }, [dispatch])

    const allSpots = useSelector(state => state.spots)
    const user = useSelector(state => state.session.user)
    //only using state does not work when refresh page where all state reset, still need to add fetch session spot for it
    // Filter spots that belong to the authenticated user
    const userSpots = Object.values(allSpots).filter((spot) => spot.ownerId === user.id);
    //console.log("userspots: ", userSpots)
    const createClick = () => {
        history.push("/spots/new");
      };

    if (!Object.values(userSpots).length) return <div>No Session Spots</div>;

    return (
        <div className="manage-spots">
            <h2> Manage Spots</h2>
            <button onClick={createClick}>
            Create a New Spot
            </button>
            <div className="index">
                {Object.values(userSpots).map((spot) => (
                    <div className="item" key={spot.id}>
                        <SpotIndexItem
                        spotId={spot.id} isOwner={true} ifSession= {true}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SessionSpot;
