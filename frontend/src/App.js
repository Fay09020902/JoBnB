import LoginFormPage from "./component/LoginFormPage";
import SignupFormPage from "./component/SignupFormPage";
import Navigation from "./component/Navigation";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";

function App() {
  console.log("app runs")
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
      <Route path="/login">
        <LoginFormPage />
      </Route>
      <Route path="/signup">
          <SignupFormPage />
      </Route>
    </Switch>
    )
}
    </>
  );
}

export default App;
