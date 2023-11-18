import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT'

//const LOAD_SESSIONSPOT = 'spots/LOAD_SESSIONSPOT';


/**  Action Creators: */
export const loadSpots = (spots) => ({
    type: LOAD_SPOTS,
    spots,
  });

  export const createSpot = (spot) => ({
    type: CREATE_SPOT,
    spot,
})

export const deleteSpot = (spotId) => ({
    type: DELETE_SPOT,
    spotId,
});
// export const loadSessionSpot = (spot) => ({
//     type: LOAD_SPOTS,
//     spot,
// })



// export const addSpotImagesToState = (id, images) => async (dispatch) => {
//     console.log("add iamges to spot state thunk runs")

//     const response = await csrfFetch(`/api/spots/${id}`)
//     if (response.ok) {
//         const spot = await response.json();
//         dispatch(loadSpotImages(id, spot.SpotImages));
//         return spot;
//     }
// }

export const loadSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots');

    if (response.ok) {
        const spots = await response.json();
        //console.log("backend spots: ", spots)
        dispatch(loadSpots(spots.Spots));
        return spots
    }
};


export const createSpotsThunk = (payload) => async (dispatch) => {
    //console.log(payload)
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const form = await response.json();
        dispatch(createSpot(form));
        return form;
      }
}

export const getSpotsDetailsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
    if (response.ok) {
        const spot = await response.json();
        //console.log("spot in backend", spot)
        dispatch(createSpot(spot));
        return spot;
    }
}



export const updateSpotThunk = (payload, spotId) => async (dispatch) => {
    //console.log(payload)
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const form = await response.json();
        dispatch(createSpot(form));
        return form;
      }
}

export const loadSessionSpotsThunk = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots/current');

    if (response.ok) {
        const spots = await response.json();
        dispatch(loadSpots(spots.Spots));
        return spots
    }
};


export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(deleteSpot(spotId));
      return data;
    } else {
      const error = await response.json();
      return error;
    }
  };

const initialState = {}

const spotReducer = (state = initialState, action) => {
    let newState
    switch (action.type) {
        case LOAD_SPOTS:
            newState = Object.assign({}, state);
            // console.log("what is action spots: ", action.spots)
            // console.log(action.spots.length)

            action.spots.forEach(spot => {
                newState[spot.id] = spot}
            )
            return newState;
        case CREATE_SPOT:
            newState = {...state}

            newState[action.spot.id] = {...action.spot}
            return newState
        case DELETE_SPOT:
            const allSpots = { ...state };
            delete allSpots[action.spotId];
            return allSpots;
        // case LOAD_SPOTIMAGES:
        //     return {
        //         ...state,
        //         [action.id]: {
        //             ...state[action.id],
        //             SpotImages: action.images
        //         }
        //     }
        default:
            return state;
    }
}

export default spotReducer;
