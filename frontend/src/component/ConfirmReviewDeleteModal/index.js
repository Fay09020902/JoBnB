import React, { useEffect, useState } from "react";
import * as reviewActions from "../../store/reviews";
import { useDispatch} from "react-redux";
import { useModal } from "../../context/Modal";
import {deleteReviewThunk} from '../../store/reviews'


function ConfirmReviewDeleteModal({spotid, reviewid}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [errors, setErrors] = useState({});


  const handleDelete = (e) => {
    if(e.target.value === 'Yes'){
      return dispatch(deleteReviewThunk(reviewid, spotid))
      .then(closeModal)
      .catch(async err => {
        const data = await err.json();
        setErrors({message:data.message});
     });
    } else {
      dispatch(closeModal)
    }

  };


  return (
    <div className ='form-container'>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this review?</p>
      {errors && <p className="error-message">{errors.message}</p>}
      <button value="Yes" onClick={handleDelete}>Yes</button>
       <button value="No" onClick={handleDelete}>No</button>
    </div>
  );
}

export default ConfirmReviewDeleteModal;
