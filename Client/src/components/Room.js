import React from 'react'
import pic2 from './images/pic2.jpg'
import { UserContext } from './UserContext';
import { DetailsContext } from './DetailsContext';
import {useContext} from 'react';
import { useNavigate } from "react-router-dom";
import LoginNav from './LoginNav';
import { Button } from '@mui/material';

const Room = ({ RoomNumber, floor, freerooms, roomrent, roomFeatures, description, ac }) => {
  const navigate = useNavigate();
  const { setDetail } = useContext(DetailsContext);

  const handleBooking = () => {
    setDetail({
      RoomNumber: RoomNumber,
      feeAmount: roomrent
    });

    navigate("/Payment");
  };

  return (
    <div className="card h-100">
      <img src={pic2} className="card-img-top" alt="Room" style={{ height: '200px', objectFit: 'cover' }} />
      <div className="card-body">
        <h5 className="card-title">Room {RoomNumber}</h5>
        <div className="room-details">
          <p><strong>Floor:</strong> {floor}</p>
          <p><strong>Available Beds:</strong> {freerooms}</p>
          <p><strong>Monthly Rent:</strong> ₹{roomrent}/-</p>
          <p><strong>Features:</strong> {roomFeatures}</p>
          <p><strong>Description:</strong> {description}</p>
          <p><strong>AC:</strong> {ac ? 'Yes' : 'No'}</p>
        </div>
        <div className="text-center mt-3">
          {freerooms > 0 ? (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleBooking}
              fullWidth
            >
              Book Now
            </Button>
          ) : (
            <Button 
              variant="contained" 
              disabled 
              fullWidth
            >
              House Full
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

{/* <Button variant="outlined">Outlined</Button> */}

export default Room