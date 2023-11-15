import { useEffect, useState } from 'react';
import { useDispatch, useSelector} from "react-redux";
import { useParams} from 'react-router-dom';
import {getSpotsDetailsThunk} from '../../store/spots'
import OpenModalButton from '../OpenModalButton'
import CreateReviewModal from '../CreateReviewModal'
import SpotReviews from '../SpotReviews';
import './SpotDetail.css';


function SpotDetail() {
    console.log("spotdetail runs")
    const dispatch = useDispatch();
    const {spotId} = useParams()
    const spot = useSelector(state => state.spots[spotId]);
    console.log("spot: ", spot)
    const session = useSelector(state => state.session)
    const reviews = useSelector(state => state.reviews)
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getSpotsDetailsThunk(spotId)).then(() => setIsLoaded(true));
    }, [dispatch, reviews, spotId])

    const setAlert = () => {
        alert("Feature coming soon")
    }

    const hidePostReview = () => {
        const spotReviews = reviews[spotId]
        if(!spotReviews) {
            return false
        } else {
        return Object.values(spotReviews).some((review) => {
            return review.userId === session.user.id;
        })}
    };

    if (!spot || !spot.Owner) {
        return null;
      }

    if(!isLoaded) {
    return <div>Unable to retrieve details. Please try again shortly.</div>
  }
    return (
        <>
        {isLoaded && (
           <div className='spot-detail'>
                <h2>{spot.name}</h2>
                <div className='location'>
                    {`${spot.city}, ${spot.state}, ${spot.country}`}
                </div>
                <div className='spot-images'>
                    <div className='large-images'>
                        {spot.SpotImages && spot.SpotImages[spot.SpotImages.length - 1]  && (
                                <div className='large-image'>
                                    <img
                                        className='spot-detail-image'
                                        alt={spot.SpotImages[spot.SpotImages.length - 1].url}
                                        src={spot.SpotImages[spot.SpotImages.length - 1].previewImage}
                                    />
                                </div>
                        )}
                    </div>
                    <div className='small-images'>
                        {spot.SpotImages &&
                        spot.SpotImages.slice(0, -1).map((image) => (
                            <div className='spot-image-each-small' key={image.id}>
                            <img
                                className='spot-detail-image-small'
                                alt={image.url}
                                src={image.previewImage}
                            />
                             </div>
                        ))}
                    </div>
                </div>
                <div className='info-session'>
                    <div>
                        <div>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
                        <p>{spot.description}</p>
                    </div>
                    <div className='pricing-section'>
                        <div className='rating-and-reviews'>
                            <span>{`$${spot.price}night`} ⭐{spot.avgStarRating.toFixed(1)}</span>
                            {spot.numReviews > 0 &&
                            <span> ·  #{spot.numReviews === 1 ?(<span>1 review</span>):(<span>{spot.numReviews} reviews</span>)} </span>
                            }
                        </div>

                      <div>
                      <button onClick={() => setAlert()}>Reserve</button>
                      </div>
                    </div>
                </div>
                <hr />
                <div className='review-session'>
                <div>⭐{spot.avgStarRating.toFixed(1)} #{spot.numReviews} {spot.numReviews === 1 ?(<span>review</span>):(<span>reviews</span>)}</div>
                    {session.user && (session.user.id !== spot.ownerId)  && !hidePostReview() &&
                        (<div>
                        <OpenModalButton
                        buttonText="Post Your Review"
                        modalComponent={<CreateReviewModal spotid={spotId}/>}
                        />
                        {!spot.numReviews && (
                            <div>Be the first to post a review!</div>
                        ) }
                   </div>)
                    }
                   <SpotReviews spotid={spotId}/>
                </div>
            </div>
    )}
    </>
    )

}

export default SpotDetail;
