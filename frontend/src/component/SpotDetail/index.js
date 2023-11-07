import { useEffect } from 'react';
import { useDispatch, useSelector} from "react-redux";
import { useParams} from 'react-router-dom';
import {getSpotsDetailsThunk} from '../../store/spots'
import SpotDetails from './SpotDetail.css';


function SpotDetail() {
    console.log("spotdetail runs")
    const dispatch = useDispatch();
    const {spotId} = useParams()
    const spot = useSelector(state => state.spots[spotId]);

    useEffect(() => {
        dispatch(getSpotsDetailsThunk(spotId))
    }, [dispatch])

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
                            <div className='spot-image-each'>
                                <img
                                    className="spot-detail-image"
                                    alt={image.url}
                                    key={image.id}
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
                      {`$${spot.price}night`}  ⭐{spot.avgStarRating} #{spot.numReviews}
                      <div>
                      <button onClick={() => setAlert()}>Reserve</button>
                      </div>
                    </div>
                </div>
                <div className='review-session'>
                   <div>{`$${spot.price}night`}  ⭐{spot.avgStarRating} #{spot.numReviews}</div>
                   <div>Review Session</div>
                </div>
            </div>
    )
}

export default SpotDetail;
