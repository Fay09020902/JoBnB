import React, { useEffect, useState } from "react";
import * as reviewActions from "../../store/reviews";
import { useDispatch, useSelector} from "react-redux";
import { useModal } from "../../context/Modal";
import './CreateReviewModal.css'


function CreateReviewModal({spotid}) {
  const dispatch = useDispatch();
  const session = useSelector(state => state.session)
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
   console.log(errors)

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(reviewActions.addSpotReviewThunk( review, stars, spotid, session ))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data) {
          setErrors({errs:{...data.errors}, message: data.message});
        }
      });
  };


  return (
    <div className ='form-container'>
      <h1>How was your stay</h1>
      <form onSubmit={handleSubmit} className="review-form">
        <label>
        {errors.message && <p className="error-message">{errors.message}</p>}
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
            placeholder="Leave your review here..."
          />
        </label>
        {errors.errs && <p className="error-message">{errors.errs.review}</p>}
        <label>
          Stars
          <input
            value={stars}
            onChange={(e) => setStars(e.target.value)}
            required
          />
        </label>
        {errors.errs && <p className="error-message">{errors.errs.stars}</p>}
        <button type="submit" disabled={disabled}>Submit Your Review</button>
      </form>
    </div>
  );
}

export default CreateReviewModal;
