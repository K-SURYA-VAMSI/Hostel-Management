import React from 'react'
import {useNavigate} from "react-router-dom";
import LoginNav from "./LoginNav"
function SuccessPage() {
const navigate=useNavigate();

function send(){
  navigate("/main");
}
  return (
    <>
    <LoginNav/>
    <div class="success"><h2>Room Booked Successfully 🥳🎉</h2>

</div>
<div class="but">
<button onClick={send}>Continue</button>
</div>
    </>
  )
}

export default SuccessPage