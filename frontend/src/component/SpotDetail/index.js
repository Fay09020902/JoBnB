import { useEffect } from 'react';
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
    console.log("spots,", useSelector(state => state.spots))
    const session = useSelector(state => state.session)
    const reviews = useSelector(state => state.reviews)
    useEffect(() => {
        //console.log("useeffect for spotdetail runs")
        dispatch(getSpotsDetailsThunk(spotId))
    }, [dispatch, reviews, spotId])

    const setAlert = () => {
        alert("Feature coming soon")
    }

    if (!spot || !spot.Owner) {
        return null;
      }

    return (
           <div className='spot-detail'>
                <h2>{spot.name}</h2>
                <div className='location'>
                    {`${spot.city}, ${spot.state}, ${spot.country}`}
                </div>
                <div className='spot-images'>
                    {spot.SpotImages &&
                    spot.SpotImages.map(image => {
                        return (
                            <div className='spot-image-each' key={image.id}>
                                <img
                                    className="spot-detail-image"
                                    alt={image.url}
                                    src={`${image.previewImage}`}
                                />
                            </div>
                            )}
                        )}
                </div>
                <div className='info-session'>
                    <div>
                        <div>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
                        <div>{spot.description}</div>
                    </div>
                    <div>
                      {`$${spot.price}night`} ⭐{spot.avgStarRating}
                      {spot.numReviews > 0 && <span> · #{spot.numReviews === 1 ?(<span>1 review</span>):(<span>{spot.numReviews} reviews</span>)} </span>
                      }
                      <div>
                      <button onClick={() => setAlert()}>Reserve</button>
                      </div>
                    </div>
                </div>
                <hr />
                <div className='review-session'>
                     <OpenModalButton
                    buttonText="Post Your Review"
                    modalComponent={<CreateReviewModal spotid={spotId}/>}
                    />
                   <div>⭐{spot.avgStarRating} #{spot.numReviews} {spot.numReviews === 1 ?(<span>review</span>):(<span>reviews</span>)}</div>
                   {!spot.numReviews && session.user && (session.id !== spot.Owner.id) && (
                    <div>Be the first to post a review!</div>
                   ) }
                   <SpotReviews spotid={spotId}/>
                </div>
            </div>
    )
}

export default SpotDetail;
