import { csrfFetch } from "./csrf";

export const ADD_REVIEW = 'reviews/ADD_REVIEW';
export const LOAD_REVIEW = 'reviews/LOAD_REVIEW'

export const addSpotReview = (review) => ({
    type: ADD_REVIEW,
    review,
})

export const loadSpotReview = (reviews, spotId) => ({
    type: LOAD_REVIEW,
    reviews, ///array
    spotId
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
        //console.log("backend spotsreviews: ", spotsreviews)
        dispatch(loadSpotReview(spotsreviews, spotid));
        return spotsreviews
    }
};



const initialState = {}

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_REVIEW:
            const {id, spotId} = action.review
            if (state[spotId]) {
                // If it exists, add the new review to the existing reviews for that spot
                return {
                  ...state,
                  [spotId]: {
                    ...state[spotId],
                    [id]: action.review,
                  },
                };
              } else {
                // If the spotId doesn't exist, create a new entry for that spot with the new review
                return {
                  ...state,
                  [spotId]: {
                    [id]: action.review,
                  },
                };
              }
        case LOAD_REVIEW:
            // Handle fetching reviews and update the state
            //console.log("console.log(action.reviews.Reviews)", action.reviews.Reviews)
            const newState = {}
            action.reviews.Reviews.forEach(review => newState[review.id] = review)
            return {
                ...state,
                [action.spotId]: {...newState}
            };
            // newState = Object.assign({}, state);
            // console.log(action.reviews.Reviews)
            // action.reviews.Reviews.forEach((review) => {
            //     newState[review.spotId] = review;
            //   });
            //   return newState
        default:
            return state;
    }
}

export default reviewReducer;
