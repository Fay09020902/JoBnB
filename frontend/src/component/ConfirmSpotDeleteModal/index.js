import React, { useEffect, useState } from "react";
import { useDispatch} from "react-redux";
import { useModal } from "../../context/Modal";
import {deleteSpotThunk} from '../../store/spots'


function ConfirmSpotDeleteModal({spot}) {
  //console.log("delete spot modal runs")
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
      return dispatch(deleteSpotThunk( spot.id ))
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
