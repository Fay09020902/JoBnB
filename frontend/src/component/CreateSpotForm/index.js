import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { createSpotsThunk } from '../../store/spots';
import { addSpotImagesThunk } from '../../store/spotimages'
import './CreateSpotForm.css'


function CreateSpotForm(){
    const dispatch = useDispatch();
    const history = useHistory();
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [image1, setImage1] = useState("");
    const [image2, setImage2] = useState("");
    const [image3, setImage3] = useState("");
    const [image4, setImage4] = useState("");
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

    const spotImages = []
    useEffect(() => {
        const err = {}
        if (!country) err.country = "Country is required";
        if (!address) err.address = "Address is required";
        if (!city) err.city = "City is required";
        if (!state) err.state = "State is required";
        if (!lng) {
            err.lng = "Longitude is required";
          } else {
            const lngFloat = parseFloat(lng);
            if (isNaN(lngFloat) || lngFloat < -180 || lngFloat > 180) {
              err.lng = "Longitude must be a valid number between -180 and 180";
            }
          }
          if (!lat) {
            err.lat = "Latitude is required";
          } else {
            const latFloat = parseFloat(lat);
            if (isNaN(latFloat) || latFloat < -90 || latFloat > 90) {
              err.lat = "Latitude must be a valid number between -90 and 90";
            }
          }
        if (description && description.length < 30)
           err.description = "Description needs 30 or more characters";
        if (!description) err.description = "Description is required";
        if (!name) err.name = "Name is required";
        if (!price) err.price = "Price is required";
        if (!previewImage) err.previewImage = "Preview image is required";
        if (previewImage && !isImageValid(previewImage)) {
            err.previewImage= 'Image URL must end in .png, .jpg, or .jpeg';
        }
        if (image1 && !isImageValid(image1)) {
            err.image1= 'Image URL must end in .png, .jpg, or .jpeg';
        }
        if (image2 && !isImageValid(image2)) {
            err.image2= 'Image URL must end in .png, .jpg, or .jpeg';
        }
        if (image3 && !isImageValid(image3)) {
            err.image3= 'Image URL must end in .png, .jpg, or .jpeg';
        }
        if (image4 && !isImageValid(image4)) {
            err.image4= 'Image URL must end in .png, .jpg, or .jpeg';
        }

        setErrors(err);

    },  [
        country,
        address,
        city,
        state,
        lat,
        lng,
        description,
        name,
        price,
        previewImage,
        image1,
        image2,
        image3,
        image4,
      ])

    console.log("submitted", submitted)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true)
        const spot = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
          };

        const spotImages = [{url:previewImage, preview: true}]
        if (image1) spotImages.push({ url: image1, preview: false });
        if (image2) spotImages.push({ url: image2, preview: false });
        if (image3) spotImages.push({ url: image3, preview: false });
        if (image4) spotImages.push({ url: image4, preview: false });

        //if no errors
        if(!Object.values(errors).length) {
            try {
                const spot_response = await dispatch(createSpotsThunk(spot));
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


        // const spot_response = dispatch(createSpotsThunk(spot))
        //                     .catch(async (res) => {
        //                         const data = await res.json();
        //                         if (data && data.errors) {
        //                             setErrors(data.errors);
        //                         }
        //                     });

        // if(spot_response) {
        //     history.push(`/spots/${spot_response.id}`);
        // }
    }

    return (
        <div className="create-spot-form">
        <form onSubmit={handleSubmit} className='createform-container'>
            <div>
                <h2>Create a new Spot</h2>
            </div>
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
                    placeholder="Country"
                />
                </label>
                <div className="errors">{submitted && errors.country}</div>
                <label>
                Street Address
                <input
                    type="text"
                    value={address}
                    onChange={updateAddress}
                    placeholder="Address"
                />
                </label>
                <div className="errors">{submitted && errors.address}</div>
                <label>
                City
                <input
                    type="text"
                    value={city}
                    onChange={updateCity}
                    placeholder="City"
                />
                </label>
                <div className="errors">{submitted && errors.city}</div>
                <label>
                State
                <input
                    type="text"
                    value={state}
                    onChange={updateState}
                    placeholder="STATE"
                />
                </label>
                <div className="errors">{submitted && errors.state}</div>
                <label>
                lat
                <input
                    type="text"
                    value={lat}
                    onChange={updateLat}
                    placeholder="Latitude"
                />
                </label>
                <div className="errors">{submitted && errors.lat}</div>
                <label>
                lng
                <input
                    type="text"
                    value={lng}
                    onChange={updateLng}
                    placeholder="Longitude"
                />
                </label>
                <div className="errors">{submitted && errors.lng}</div>

            </div>
            <hr />
            <div className='description'>
            <label>
                <h3>Describe your place to guests</h3>
                <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                <textarea
                    value={description}
                    onChange={updateDescription}
                    placeholder="Please write at least 30 characters"
                />
                </label>
                <div className="errors">{submitted && errors.description}</div>
            </div>
            <hr />
            <div>
            <label>
                <h3>Create a title for your spot</h3>
                <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                <input
                    value={name}
                    onChange={updateName}
                    placeholder="Name of your spot"
                />
                </label>
                <div className="errors">{submitted && errors.name}</div>
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
                <div className="errors">{submitted && errors.price}</div>
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
            <div className="errors">{submitted && errors.previewImage}</div>
            <input
                id="image1"
                type="text"
                onChange={(e) => setImage1(e.target.value)}
                value={image1}
                placeholder="Image URL"
            />
            <div className="errors">{submitted && errors.image1}</div>
            <input
                id="image2"
                type="text"
                onChange={(e) => setImage2(e.target.value)}
                value={image2}
                placeholder="Image URL"
            />
            <div className="errors">{submitted && errors.image2}</div>
            <input
                id="image3"
                type="text"
                onChange={(e) => setImage3(e.target.value)}
                value={image3}
                placeholder="Image URL"
            />
             <div className="errors">{submitted && errors.image3}</div>
            <input
                id="image4"
                type="text"
                onChange={(e) => setImage4(e.target.value)}
                value={image4}
                placeholder="Image URL"
            />
             <div className="errors">{submitted && errors.image4}</div>
            </div>
            <hr />
           <button type="submit">Create a Spot</button>
        </form>
        </div>
        );
}

export default CreateSpotForm;
