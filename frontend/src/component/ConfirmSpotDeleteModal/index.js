import React, { useEffect, useState } from "react";
import * as reviewActions from "../../store/reviews";
import { useDispatch} from "react-redux";
import { useParams} from 'react-router-dom';
import { useModal } from "../../context/Modal";
import {deleteReviewThunk} from '../../store/reviews'


function ConfirmSpotDeleteModal({spot}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();


  // useEffect(() => {
  //   if( review.length >= 10 && stars >= 1) {
  //     setDisabled(false)
  //   }
  //   else {
  //     setDisabled(true)
  //   }
  // }, [review, stars])
  //  console.log(errors)

  const handleDelete = (e) => {
    if(e.target.value === 'Yes'){
      return dispatch(deleteReviewThunk( spot.id ))
      .then(closeModal)
    } else {
      dispatch(closeModal)
    }

  };


  return (
    <div className ='form-container'>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this spot from the listings?</p>
      <button value="Yes" onClick={handleDelete}>Yes</button>
       <button value="No" onClick={handleDelete}>No</button>
    </div>
  );
}

export default ConfirmSpotDeleteModal;
