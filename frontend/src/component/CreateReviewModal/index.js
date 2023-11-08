import React, { useEffect, useState } from "react";
import * as reviewActions from "../../store/reviews";
import { useDispatch} from "react-redux";
import { useParams} from 'react-router-dom';
import { useModal } from "../../context/Modal";
import './CreateReviewModal.css'


function CreateReviewModal({spotid}) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState("");
  const [disabled, setDisabled] = useState(true)
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();


  useEffect(() => {
    if( review.length >= 10 && stars >= 1) {
      setDisabled(false)
    }
    else {
      setDisabled(true)
    }
  }, [review, stars])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(reviewActions.addSpotReviewThunk( review, stars, spotid ))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors(data.message);
        }
      });
  };


  return (
    <div className ='form-container'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="review-form">
        <label>
        How was your stay?
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </label>
        <label>
          Stars
          <input
            value={stars}
            onChange={(e) => setStars(e.target.value)}
            required
          />
        </label>
        {{errors} && <p className="error-message">{Object.values(errors)}</p>}
        <button type="submit" disabled={disabled}>Submit Your Review</button>
      </form>
    </div>
  );
}

export default CreateReviewModal;
