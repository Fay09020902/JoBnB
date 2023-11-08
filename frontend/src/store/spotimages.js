import { csrfFetch } from "./csrf";

export const LOAD_SPOTIMAGES = 'images/LOAD_SPOTIMAGES';


export const addSpotImage = (image, spotid) => ({
    type: LOAD_SPOTIMAGES,
    image,
    spotid
})


export const addSpotImagesThunk = (images, spotid) =>async (dispatch) => {
    console.log("addSpotImagesThunk runs")
    console.log("iamges: ", images)
    const uploadedImages = []
    for(let image of images) {
        console.log("loop running for image: ", image)
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


const initialState = {}

const spotImagesReducer = (state = initialState, action) => {
    let newState
    switch (action.type) {
        case LOAD_SPOTIMAGES:
            const {url, preview, id} = action.image
            newState = Object.assign({}, state);
            console.log("what is spots image in action: ", action)
            // console.log(action.spots.length)
            if(newState[action.spotid]) {
                newState[action.spotid].push({url, preview})
            } else {
                newState[action.spotid] = [{url, preview}]
            }
            return newState;
        default:
            return state;
    }
}

export default spotImagesReducer;
