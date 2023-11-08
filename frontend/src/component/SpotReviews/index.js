import { useEffect } from 'react';
import { useDispatch, useSelector} from "react-redux";
import {loadSpotReviewThunk} from '../../store/reviews'


function SpotReviews({spotid}) {
    console.log("SpotReviews runs")
    const dispatch = useDispatch();
    // const spot = useSelector(state => state.spots[spotid]);
    // const session = useSelector(state => state.session)
    useEffect(() => {
        const spotsreviews = dispatch(loadSpotReviewThunk(spotid))
        console.log(spotsreviews)
    }, [dispatch])
    const fetchSpotReviews = async () => {
        const reviews = await dispatch(loadSpotReviewThunk(spotid));
        dispatch(loadSpotReviews(reviews));
        setFetchedReviews(reviews);
    };
    fetchSpotReviews();
    return (
        <></>
    )
}

export default SpotReviews;
