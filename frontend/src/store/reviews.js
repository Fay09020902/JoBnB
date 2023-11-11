import { csrfFetch } from "./csrf";

export const ADD_REVIEW = 'reviews/ADD_REVIEW';
export const LOAD_REVIEW = 'reviews/LOAD_REVIEW'
export const LOAD_SESSIONREVIEW = 'spots/LOAD_SESSIONREVIEW';
const DELETE_REVIEW = "review/delete";

export const addSpotReview = (review, session) => ({
    type: ADD_REVIEW,
    review,
    session
})

export const loadSpotReview = (reviews, spotId) => ({
    type: LOAD_REVIEW,
    reviews, ///array
    spotId
})


export const loadSessionReview = (reviews) => ({
    type: LOAD_SESSIONREVIEW,
    reviews,
})

const deleteReview = (reviewid,spotid) => {
  return {
    type: DELETE_REVIEW,
    reviewid,
    spotid
  };
};

export const addSpotReviewThunk = (review, stars, spotid, session) =>async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotid}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({review, stars})
      });
      if (response.ok) {
        const review = await response.json();
        dispatch(addSpotReview(review, session));
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

export const loadSessionReviewsThunk = () => async (dispatch) => {
  const response = await csrfFetch('/api/reviews/current');

  if (response.ok) {
      const reviews = await response.json();
      dispatch(loadSessionReview(reviews));
      return reviews
  }
};

export const deleteReviewThunk = (reviewid,spotid) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewid}`, {
    method: "DELETE",
  });

  if (response.ok) {
    const data = await response.json();

    dispatch(deleteReview(reviewid,spotid));
    return data;
  } else {
    const errors = await response.json();
    return errors;
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
                    [id]: {User:{...action.session.user}, ...action.review},
                  },
                };
              } else {
                // If the spotId doesn't exist, create a new entry for that spot with the new review
                return {
                  ...state,
                  [spotId]: {
                    [id]: {User:{...action.session.user}, ...action.review},
                  },
                };
              }
        case LOAD_REVIEW:
            // Handle fetching reviews and update the state
            //console.log("console.log(action.reviews.Reviews)", action.reviews.Reviews)
            const newState = {}
            action.reviews.Reviews.forEach(review => {newState[review.id] = review})
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
        case LOAD_SESSIONREVIEW:
          const anotherNewState = {}
            action.reviews.Reviews.forEach(obj => {
              if (state[obj.spotId]) {
                // If it exists, add the new review to the existing reviews for that spot
                anotherNewState[obj.spotId] = {
                  ...state[obj.spotId],
                  [obj.id]: obj,
                }
              } else {
                anotherNewState[obj.spotId] = {[obj.id]: obj}
              }
              }
                )
          return {
              ...state,
              ...anotherNewState
          };

        case DELETE_REVIEW:
          const allReviews = { ...state };
          delete allReviews[action.spotid][action.reviewid];
          return allReviews
        default:
            return state;
    }
}

export default reviewReducer;
