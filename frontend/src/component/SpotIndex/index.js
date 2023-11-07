import { useEffect } from 'react';
import { useDispatch, useSelector} from "react-redux";
import { loadSpotsThunk } from '../../store/spots';
import SpotIndexItem from '../SpotIndexItem';
import SpotIndex from './SpotIndex.css';

function SportIndex() {
    const dispatch = useDispatch();

    const allSpots = useSelector(state => state.spots)
    //console.log("spots in compnent: ", allSpots)
    useEffect(() => {
        dispatch(loadSpotsThunk())
    }, [dispatch])

    if (!Object.values(allSpots).length) return <div>No Spots</div>;

    return (
        <div className="index">
            {Object.values(allSpots).map((spot) => (
                <div className="item" key={spot.id}>
                    <SpotIndexItem
                    spot={spot}/>
                </div>
            ))}
        </div>
    )
}

export default SportIndex;
