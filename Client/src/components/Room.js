import React from 'react'
import pic2 from './images/pic2.jpg'
import { UserContext } from './UserContext';
import { DetailsContext } from './DetailsContext';
import {useContext} from 'react';
import { useNavigate } from "react-router-dom";
import LoginNav from './LoginNav';
import { Button } from '@mui/material';

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
    <div class="d-flex justify-content-center">
      {data.freerooms>0?<Button variant="contained"   onClick={SetMethod} name="roomNumber" >Book</Button>:<Button disabled>House Full</Button>}
    </div>
    </div>
    </> 
  )
}

{/* <Button variant="outlined">Outlined</Button> */}

export default Room