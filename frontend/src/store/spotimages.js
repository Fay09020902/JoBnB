import { csrfFetch } from "./csrf";

export const ADD_SPOTIMAGES = 'images/ADD_SPOTIMAGES';
export const DELETE_SPOTIMAGES = 'images/DELETE_SPOTIMAGES'
export const LOAD_SPOTIMAGES = 'images/LOAD_SPOTIMAGES'


export const addSpotImage = (image, spotid) => ({
    type: ADD_SPOTIMAGES,
    image,
    spotid
})

export const loadSpotImages = (spotId, images) => ({
    type: LOAD_SPOTIMAGES,
    spotId,
    images  //array [{url, preview}, ]
  });

export const deleteAllSpotImage = (spotId, spotImages) => ({
    type: DELETE_SPOTIMAGES,
    spotId,
    spotImages
})

export const addSpotImagesThunk = (images, spotid) =>async (dispatch) => {
    //console.log("addSpotImagesThunk runs")
    //console.log("iamges: ", images)
    const uploadedImages = []
    for(let image of images) {
        //console.log("loop running for image: ", image)
        const {url, preview} = image

        const response = await csrfFetch(`/api/spots/${spotid}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({url, preview})
            });
        if (response.ok) {
            const image = await response.json();
            dispatch(addSpotImage(image, spotid));
            uploadedImages.push(image)
        }
    }
    return uploadedImages
}

  export const deleteAllSpotImagesThunk = (spotId) => async (dispatch, getState) => {
    const state = getState();
    const spotImages = state.spotImages[spotId] || [];

    const deleteRequests = spotImages.map(async (image) => {
      const response = await csrfFetch(`/api/spot-images/${image.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        return response.json();
      } else {
        const errors = await response.json();
        return errors;
      }
    });

    // Wait for all delete requests to complete
    const deleteResponses = await Promise.all(deleteRequests);
    // Return the responses from the delete requests
    return deleteResponses;
  };
const initialState = {}

const spotImagesReducer = (state = initialState, action) => {
    let newState
    switch (action.type) {
        case ADD_SPOTIMAGES:
            const {id, url, preview} = action.image
            newState = Object.assign({}, state);
           // console.log("what is spots image in action: ", action)
            // console.log(action.spots.length)
            if(newState[action.spotid]) {
                newState[action.spotid].push({id, url, preview})
            } else {
                newState[action.spotid] = [{id, url, preview}]
            }
            return newState;
        case LOAD_SPOTIMAGES:
            newState = Object.assign({}, state);
            const {images, spotId} = action
            console.log("images: ", images)
            newState[spotId] = [...images]
            return newState
        default:
            return state;
    }
}

export default spotImagesReducer;
