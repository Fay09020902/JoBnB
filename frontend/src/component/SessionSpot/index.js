import { useEffect } from 'react';
import { useDispatch, useSelector} from "react-redux";
import { loadSessionSpotsThunk } from '../../store/spots';
import SpotIndexItem from '../SpotIndexItem';

function SessionSpot() {
    console.log("session spot component runs")
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(loadSessionSpotsThunk(user.id));
            } catch (error) {
                const data = await error.json();
                console.error('Error fetching data:', data);
            }
        };
        fetchData();
    }, [dispatch])

    const allSpots = useSelector(state => state.spots)
    const user = useSelector(state => state.session.user)
    //only using state does not work when refresh page where all state reset, still need to add fetch session spot for it
    // Filter spots that belong to the authenticated user
    const userSpots = Object.values(allSpots).filter((spot) => spot.ownerId === user.id);


    if (!Object.values(userSpots).length) return <div>No Session Spots</div>;

    return (
        <div className="index">
            {Object.values(userSpots).map((spot) => (
                <div className="item" key={spot.id}>
                    <SpotIndexItem
                    spot={spot} isOwner={true}/>
                </div>
            ))}
        </div>
    )
}

export default SessionSpot;
