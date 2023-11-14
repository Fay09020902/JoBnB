import ConfirmReviewDeleteModal from '../ConfirmReviewDeleteModal'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector} from "react-redux";
import { loadSessionReviewsThunk } from '../../store/reviews';


function SessionReview() {
    console.log("session review component runs")
    const dispatch = useDispatch();

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
        const fetchData = async () => {
            try {
                const userReviews = await dispatch(loadSessionReviewsThunk());
                console.log("userreviews; " ,userReviews)
            } catch (error) {
                const data = await error.json();
                console.error('Error fetching data:', data);
            }
        };
        fetchData();
    }, [dispatch])

    const allReviews = useSelector(state => state.reviews)
    const user = useSelector(state => state.session.user)
    //only using state does not work when refresh page where all state reset, still need to add fetch session spot for it
    // Filter spots that belong to the authenticated user
    const userSessions = []
    Object.values(allReviews).forEach((review) => {
        Object.values(review).forEach(ele => {
            if(ele.userId === user.id) {
                userSessions.push(ele)
            }
        })
    })



   if (!userSessions.length) return <div>No Session Reviews</div>;

    return (
        <div className="manage-reviews">
            <div className="index">
                <ul>
                {userSessions.map(ele => (
                <div key={ele.id}>
                    <li>{ele.review}</li>
                    {console.log("current ele:", ele)}
                    <OpenModalMenuItem
                        itemText="Delete"
                        onItemClick={closeMenu}
                        modalComponent={<ConfirmReviewDeleteModal spotid={ele.spotId} reviewid={ele.id} />}
                    />
                </div>
          ))}
                </ul>
            </div>
        </div>
    )
}

export default SessionReview;
