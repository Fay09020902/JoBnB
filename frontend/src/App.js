import Navigation from "./component/Navigation";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SportIndex from "./component/SpotIndex";
import SpotDetail from "./component/SpotDetail";
import CreateSpotForm from "./component/CreateSpotForm";
import * as sessionActions from "./store/session";

function App() {
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(sessionActions.restoreUser());
  // }, [dispatch]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);



  return (
    <>
     <Navigation isLoaded={isLoaded} />
    {isLoaded && (
      <Switch>
        <Route exact path="/spots" component={SportIndex} />
        <Route exact path="/spots/new" component={CreateSpotForm} />
        <Route exact path="/spots/:spotId" component={SpotDetail} />
      </Switch>
      )
    }
    </>
  );
}

export default App;
