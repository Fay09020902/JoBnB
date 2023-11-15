import Navigation from "./component/Navigation";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SportIndex from "./component/SpotIndex";
import SpotDetail from "./component/SpotDetail";
import CreateSpotForm from "./component/CreateSpotForm";
import SessionSpot from "./component/SessionSpot"
import EditSpotForm from './component/EditSpotForm'
import * as sessionActions from "./store/session";
import SessionReview from "./component/SessionReview"


function App() {
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(sessionActions.restoreUser());
  // }, [dispatch]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  if(!isLoaded) {
    return <div>Unable to retrieve spots. Please try again shortly.</div>
  }

  return (
    <div className="app">
      <Navigation isLoaded={isLoaded} />
      <hr />
      {isLoaded && (
        <Switch>
          <Route exact path="/" component={SportIndex} className="SportIndex" />
          <Route exact path="/spots" component={SportIndex} className="SportIndex" />
          <Route exact path="/spots/new" component={CreateSpotForm} className="CreateSpotForm" />
          <Route exact path="/spots/current" component={SessionSpot} className="SessionSpot" />
          <Route exact path="/spots/:spotId" component={SpotDetail} className="SpotDetail" />
          <Route exact path="/spots/:spotId/edit" component={EditSpotForm} className="EditSpotForm" />
          <Route exact path="/reviews/current" component={SessionReview} />
        </Switch>
        )
      }
    </div>
  );
}

export default App;
