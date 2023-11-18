
import { useDispatch, useSelector} from "react-redux";
import { loadSpotReviewThunk} from '../../store/reviews'
import ConfirmReviewDeleteModal from '../ConfirmReviewDeleteModal'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import React, { useState, useEffect, useRef } from "react";
import './SpotReviews.css'

function SpotReviews({spotid}) {
    //console.log("SpotReviews runs")
    const dispatch = useDispatch();
    //const [reviews, setReviews] = useState([]);
    //dosen't work for refresh, need to load spot review first
    const user = useSelector(state => state.session.user)
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef(null);

    const openMenu = () => {
      if (showMenu) return;
      setShowMenu(true);
    };

    useEffect(() => {

      if (!showMenu) return;

      const closeMenu = (e) => {
        if (ulRef.current && !ulRef.current.contains(e.target)) { // Check if ulRef.current exists
          setShowMenu(false);
        }
      };

      document.addEventListener('click', closeMenu);

      return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    useEffect(() => {
        dispatch(loadSpotReviewThunk(spotid))
   }, [dispatch])


    let reviews
    const spotReviews = useSelector(state => state.reviews[spotid])
    if(!spotReviews) {
        return <></>
    } else {
        reviews = Object.values(spotReviews)
    }

    const order = Object.keys(spotReviews)
    .sort((a, b) => b - a)
    // console.log(order)
    // useEffect(() => {
    //     setReviews(Object.values(reviewsSpot))
    // }, [])


    // useEffect(() => {
    //     console.log("useeffect for spotreview runs")
    //     const loadReviews = async () => {
    //         try {

    //           const reviews = await dispatch(loadSpotReviewThunk(spotid));
    //           const spotreviews = []
    //           //console.log("review in useeffect:", reviews)
    //           reviews.Reviews.forEach(element => {spotreviews.push(element)
    //           });
    //           setReviews(spotreviews)
    //         } catch (error) {
    //           console.error('Error loading reviews:', error);
    //         }
    //       };

    //       loadReviews();
    // }, [])

    return (
        <>
          {order && order.length > 0 && (
                <ul>
                    {order.map(reviewid => {
                       const review = spotReviews[reviewid];
                      const reviewDate = new Date(review.createdAt);
                      const formattedDate = reviewDate.toLocaleDateString()
                        return (
                           <li key={reviewid}>
                              <div>{spotReviews[reviewid].User.firstName}</div>
                              <div>{formattedDate}</div>
                              <div>{spotReviews[reviewid].review}</div>
                              <div className="delete-button">
                              {user && spotReviews[reviewid].userId === user.id && <OpenModalMenuItem
                              itemText="Delete"
                              onItemClick={closeMenu}
                              modalComponent={  <ConfirmReviewDeleteModal spotid = {spotid} reviewid={reviewid}/>}
                              />}
                              </div>
                         </li>)
                  })}
                </ul>)
         }
        </>
    )
}

export default SpotReviews;
