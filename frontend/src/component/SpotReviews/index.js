import { useEffect, useState } from 'react';
import { useDispatch, useSelector} from "react-redux";
import {loadSpotReviewThunk} from '../../store/reviews'


function SpotReviews({spotid}) {
    console.log("SpotReviews runs")
    const dispatch = useDispatch();
    const [reviews, setReviews] = useState([]);
    // console.log("spot reviews: ", reviews)
    const reviewsSpot = useSelector(state => state.reviews)

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

    useEffect(() =>{
      console.log("useeffect for spotreview runs")

    }, [])

    return (
        <>
        {reviews && reviews.length > 0 && (
            <ul>
                {reviews.map(review => (
                      <li key={review.id}>{review.review}</li>
                ))}
            </ul>
        )}
        </>
    )
}

export default SpotReviews;
