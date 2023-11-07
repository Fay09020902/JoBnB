import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector} from "react-redux";
import { createSpotsThunk } from '../../store/spots';
import CreateSpotForms from './CreateSpotForm.css'


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
    const [price, setPrice] = useState(0);
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


  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitted(true)
        const spot = { address, city, state, country, name, description, price, lat, lng }
        const spotImages = [{previewImage, preview: true}]
        if (image1) spotImages.push({ url: image1, preview: false });
        if (image2) spotImages.push({ url: image2, preview: false });
        if (image3) spotImages.push({ url: image3, preview: false });
        if (image4) spotImages.push({ url: image4, preview: false });

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
        try {
            const spot_response = await dispatch(createSpotsThunk(spot));
            if (spot_response) {
              history.push(`/spots/${spot_response.id}`);
            }
          } catch (error) {
              const data = await error.json();
              if (data && data.errors) {
                setErrors(data.errors);
              }
          }
    }

    return (
        <form onSubmit={handleSubmit} className='form-container'>
            <h2>Create a new Spot</h2>
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
            <input
                id="image1"
                type="text"
                onChange={(e) => setImage1(e.target.value)}
                value={image1}
                placeholder="Image URL"
            />
            <input
                id="image2"
                type="text"
                onChange={(e) => setImage2(e.target.value)}
                value={image2}
                placeholder="Image URL"
            />
            <input
                id="image3"
                type="text"
                onChange={(e) => setImage3(e.target.value)}
                value={image3}
                placeholder="Image URL"
            />
            <input
                id="image4"
                type="text"
                onChange={(e) => setImage4(e.target.value)}
                value={image4}
                placeholder="Image URL"
            />
            </div>
            <hr />
           <button type="submit">Create a Spot</button>
        </form>
        );
}

export default CreateSpotForm;
