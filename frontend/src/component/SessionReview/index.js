import { useEffect } from 'react';
import { useDispatch, useSelector} from "react-redux";
import { loadSessionReviewsThunk } from '../../store/reviews';


function SessionReview() {
    console.log("session review component runs")
    const dispatch = useDispatch();

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
                userSessions.push(ele.review)
            }
        })
    })


   if (!userSessions.length) return <div>No Session Reviews</div>;

    return (
        <div className="index">
            <ul>
                {userSessions.map(ele => (
                    <li key={ele}>{ele}</li>
                ))}

            </ul>
        </div>
    )
}

export default SessionReview;
