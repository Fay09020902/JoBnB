import { Link, useHistory, useParams  } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector} from "react-redux";
import { updateSpotThunk } from '../../store/spots';
import { addSpotImagesThunk } from '../../store/spotimages'
import './EditSpotForm.css'


function EditSpotForm(){
    const dispatch = useDispatch();
    const {spotId} = useParams()
    const history = useHistory();
    const spot = useSelector(state => state.spots[spotId]);

    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [country, setCountry] = useState(spot.country);
    const [lat, setLat] = useState(spot.lat);
    const [lng, setLng] = useState(spot.lng);
    const [name, setName] = useState(spot.name);
    const [description, setDescription] = useState(spot.name);
    const [price, setPrice] = useState(spot.price);
    const [previewImage, setPreviewImage] = useState(spot.previewImage);
    const [image1, setImage1] = useState(spot.image1 ? spot.image1 : '');
    const [image2, setImage2] = useState(spot.image2 ? spot.image2 : '');
    const [image3, setImage3] = useState(spot.image3 ? spot.image3 : '');
    const [image4, setImage4] = useState(spot.image4 ? spot.image4 : '');
    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState({});

    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateCountry = (e) => setCountry(e.target.value);
    const updateName = (e) => setName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice = (e) => setPrice(e.target.value);
    const updateLat = (e) => setLat(e.target.value);
    const updateLng = (e) => setLng(e.target.value);


    const isImageValid = (url) => {
        const validExtensions = [".png", ".jpg", ".jpeg"];
        const ext = url.split('.').pop();
        return validExtensions.includes(`.${ext}`);
      };

    const pushToImageArray = (arr, image, err, imagename) => {
        if (image) {
            if (!isImageValid(image)) {
              err[imagename] = 'Image URL must end in .png, .jpg, or .jpeg';
            } else {
                arr.push({ url: image, preview: false });
            }
          }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitted(true)
        const err = {}
        const spot = { address, city, state, country, name, description, price, lat, lng }
        const spotImages = [{url:previewImage, preview: true}]
        if (!country) err.country = "Country is required";
        if (!address) err.address = "Address is required";
        if (!city) err.city = "City is required";
        if (!state) err.state = "State is required";
        if (!description) err.description = "Description is required";
        if (!price) err.price = "Price is required";
        if (description && description.length < 30)
           err.description = "Description needs 30 or more characters";
           if (name && name.length > 50)
           err.description = "Name must be less than 50 characters";
        pushToImageArray(spotImages, image1, err , 'image1')
        pushToImageArray(spotImages, image2, err, 'image2')
        pushToImageArray(spotImages, image3, err, 'image3')
        pushToImageArray(spotImages, image4, err, 'image4')


        setErrors(err);
       // console.log("err length", Object.values(err).length)
        //of no errors
        if(!Object.values(err).length) {
            try {
                const spot_response = await dispatch(updateSpotThunk( spot, spotId ));
                if (spot_response) {
                    // dispatch(addSpotImagesThunk(spotImages, spot_response.id))
                    // .then(history.push(`/spots/${spot_response.id}`))
                    const uploadedImages = await dispatch(addSpotImagesThunk(spotImages, spot_response.id));

                    // Check if the images were successfully uploaded
                    if (uploadedImages) {
                        history.push(`/spots/${spot_response.id}`);
                }
                }
              } catch (error) {
                  const data = await error.json();
                  if (data && data.errors) {
                    setErrors(data.errors);
                  }
              }
        }
    }

    return (
        <form onSubmit={handleSubmit} className='editform-container'>
            <h2>Update your Spot</h2>
            <div className='location'>
                <h3>
                Where's your place located? Guests will only get your exact address once they booked a reservation.
                </h3>
                <label>
                Country
                <input
                    type="text"
                    value={country}
                    onChange={updateCountry}
                />
                </label>
                <div className="errors">{errors && errors.country}</div>
                <label>
                Street Address
                <input
                    type="text"
                    value={address}
                    onChange={updateAddress}
                />
                </label>
                <div className="errors">{errors && errors.address}</div>
                <label>
                City
                <input
                    type="text"
                    value={city}
                    onChange={updateCity}
                />
                </label>
                <div className="errors">{errors && errors.city}</div>
                <label>
                State
                <input
                    type="text"
                    value={state}
                    onChange={updateState}
                />
                </label>
                <div className="errors">{errors && errors.state}</div>
                <label>
                lat
                <input
                    type="text"
                    value={lat}
                    onChange={updateLat}
                />
                </label>
                <div className="errors">{errors && errors.lat}</div>
                <label>
                lng
                <input
                    type="text"
                    value={lng}
                    onChange={updateLng}
                />
                </label>
                <div className="errors">{errors && errors.lng}</div>

            </div>
            <hr />
            <div className='description'>
            <label>
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                <textarea
                    value={description}
                    onChange={updateDescription}
                />
                </label>
                <div className="errors">{errors && errors.description}</div>
            </div>
            <hr />
            <div>
            <label>
                <h3>Create a title for your spot</h3>
                <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                <input
                    value={name}
                    onChange={updateName}
                />
                </label>
                <div className="errors">{errors && errors.name}</div>
            </div>
            <hr />
            <div className='price'>
            <label>
                <h3>Set a base price for your spot</h3>
                <p>Set a base price for your spot Competitive pricing can help your listing stand out and rank higher in search results.</p>
                $<input
                    value={price}
                    onChange={updatePrice}
                    placeholder={"Price per night (USD)"}
                />
                </label>
                <div className="errors">{errors && errors.price}</div>
            </div>
            <hr />
            <div className="images">
            <h3>Liven up your spot with photos</h3>
            <p>Submit a link to at least one photo to publish your spot.</p>
            <input
                id="previewImage"
                type="text"
                onChange={(e) => setPreviewImage(e.target.value)}
                value={previewImage}
                placeholder="Preview Image URL"
            />
            <div className="errors">{errors && errors.previewImage}</div>
            <input
                id="image1"
                type="text"
                onChange={(e) => setImage1(e.target.value)}
                value={image1}
                placeholder="Image URL"
            />
            <div className="errors">{errors && errors.image1}</div>
            <input
                id="image2"
                type="text"
                onChange={(e) => setImage2(e.target.value)}
                value={image2}
                placeholder="Image URL"
            />
            <div className="errors">{errors && errors.image2}</div>
            <input
                id="image3"
                type="text"
                onChange={(e) => setImage3(e.target.value)}
                value={image3}
                placeholder="Image URL"
            />
             <div className="errors">{errors && errors.image3}</div>
            <input
                id="image4"
                type="text"
                onChange={(e) => setImage4(e.target.value)}
                value={image4}
                placeholder="Image URL"
            />
             <div className="errors">{errors && errors.image4}</div>
            </div>
            <hr />
           <button type="submit">Create a Spot</button>
        </form>
        );
}

export default EditSpotForm;
