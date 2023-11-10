
import { useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { loadSpotReviewThunk} from '../../store/reviews'


function SpotReviews({spotid}) {
    console.log("SpotReviews runs")
    const dispatch = useDispatch();
    //const [reviews, setReviews] = useState([]);
    //dosen't work for refresh, need to load spot review first
    useEffect(() => {
        console.log("useeffct for spotreview runs")
        dispatch(loadSpotReviewThunk(spotid))
   }, [dispatch])

    let reviews
    const spotReviews = useSelector(state => state.reviews[spotid])
    if(!spotReviews) {
        return <></>
    } else {
        reviews = Object.values(spotReviews)
    }

    const order = Object.keys(spotReviews)
    .sort((a, b) => a - b)
    // console.log(order)
    // useEffect(() => {
    //     setReviews(Object.values(reviewsSpot))
    // }, [])


    // useEffect(() => {
    //     console.log("useeffect for spotreview runs")
    //     const loadReviews = async () => {
    //         try {

    //           const reviews = await dispatch(loadSpotReviewThunk(spotid));
    //           const spotreviews = []
    //           //console.log("review in useeffect:", reviews)
    //           reviews.Reviews.forEach(element => {spotreviews.push(element)
    //           });
    //           setReviews(spotreviews)
    //         } catch (error) {
    //           console.error('Error loading reviews:', error);
    //         }
    //       };

    //       loadReviews();
    // }, [])

    return (
        <>
          {order && order.length > 0 && (
                <ul>
                    {order.map(reviewid => (
                        <li key={reviewid}><div>{spotReviews[reviewid].User.firstName}</div><div>{spotReviews[reviewid].review}</div></li>
                    ))}
                </ul>)
         }
        </>
    )
}

export default SpotReviews;
