import { csrfFetch } from "./csrf";

export const ADD_REVIEW = 'reviews/ADD_REVIEW';
export const LOAD_REVIEW = 'reviews/LOAD_REVIEW'

export const addSpotReview = (review) => ({
    type: ADD_REVIEW,
    review
})

export const loadSpotReview = (reviews) => ({
    type: LOAD_REVIEW,
    reviews ///array
})

export const addSpotReviewThunk = (review, stars, spotid) =>async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotid}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({review, stars})
      });
      if (response.ok) {
        const review = await response.json();
        dispatch(addSpotReview(review));
        return review;
      }
}

export const loadSpotReviewThunk = (spotid) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotid}/reviews`);

    if (response.ok) {
        const spotsreviews = await response.json();
        console.log("backend spotsreviews: ", spotsreviews)
        dispatch(loadSpotReview(spotsreviews));
        return spotsreviews
    }
};



const initialState = {}

const reviewReducer = (state = initialState, action) => {
    let newState
    switch (action.type) {
        case ADD_REVIEW:
            const {id, userId, spotId, review, stars} = action.review
            newState = Object.assign({}, state);
            return {
                ...state,
                [id]: {userId, spotId, review, stars}
            }
        case LOAD_REVIEW:
            // Handle fetching reviews and update the state
            newState = Object.assign({}, state);
            console.log(action.reviews.Reviews)
            action.reviews.Reviews.forEach((review) => {
                newState[review.id] = review;
              });
              return newState
        default:
            return state;
    }
}

export default reviewReducer;
