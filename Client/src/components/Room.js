import React from 'react'
import pic2 from './images/pic2.jpg'
import { UserContext } from './UserContext';
import { DetailsContext } from './DetailsContext';
import {useContext} from 'react';
import { useNavigate } from "react-router-dom";
import LoginNav from './LoginNav';
const Room=(data)=>
{
  const navigate = useNavigate();
  const {Detail,setDetail}=useContext(DetailsContext);

const SetMethod=(e)=>{

  setDetail({
   RoomNumber:data.RoomNumber,
   feeAmount:data.roomrent
  })

  navigate("/Payment");
}

  return(
  <>
    <div className='Room'>
      <div class='images'>
       <img src={pic2} alt="image" width={350} height={200} />
        </div>
    <h2>Room Number : {data.RoomNumber}</h2>
    <div>
    <p>Floor : {data.floor}</p>
    </div>
    <div>
    <p>Available beds : {data.freerooms}</p>
    </div>
    <div>
    <p>Room Rent : {data.roomrent}/-</p>
    </div>
    <div>
    <p>About Room: {data.description}</p>
    </div>
    <div>
    <p>Room features : {data.roomFeatures}</p>
    </div>
    <div class="container">
      {data.freerooms>0?<button onClick={SetMethod} name="roomNumber" value={data.RoomNumber}>Book</button>:<button disabled>House Full</button>}
    </div>
    </div>
    </> 
  )
}


export default Room