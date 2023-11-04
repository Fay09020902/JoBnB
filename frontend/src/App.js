import LoginFormPage from "./component/LoginFormModal";
import SignupFormPage from "./component/SignupFormModal";
import Navigation from "./component/Navigation";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
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
      </Switch>
      )
    }
    </>
  );
}

export default App;
