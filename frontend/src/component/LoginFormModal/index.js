import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch} from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom';
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  // const sessionUser = useSelector((state) => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true)
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();



  // if( credential.length >= 4 && password.length >= 6) {
  //   console.log("invalid input")
  //   console.log("now: ", disabled)
  //   setDisabled(prev => {console.log("prev:", prev); console.log(prev === disabled); return false})
  // }

  useEffect(() => {
    if( credential.length >= 4 && password.length >= 6) {
      setDisabled(false)
    }
    else {
      setDisabled(true)
    }
  }, [credential, password])

  const demoLogin = () => {
    dispatch(sessionActions.login({credential: "demo@user.io", password: "password" }));
    closeModal();
    history.push("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors(data.message);
        }
      });
  };


  return (
    <div className ='login-container'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {{errors} && <p className="error-message">{Object.values(errors)}</p>}
        <button type="submit" disabled={disabled}>Log In</button>
      </form>
      <button onClick={demoLogin}>Log In As Demo User</button>
    </div>
  );
}

export default LoginFormModal;
