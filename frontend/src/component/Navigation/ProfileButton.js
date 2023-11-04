import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";



function ProfileButton() {
   return (
        <div style={{ color: "orange", fontSize: "100px" }}>
        <i class="fa-solid fa-person"></i>
        </div>
   )
}



export default ProfileButton;
