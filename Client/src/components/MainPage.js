import React from 'react'
import LoginNav from './LoginNav';
import Room from './Room';
import {useState,useEffect,useContext} from 'react'
import { UserContext } from './UserContext';
import {useNavigate} from "react-router-dom";

const API_BASE_URL = "http://localhost:8000";

function MainPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {value,setValue}=useContext(UserContext);
  const navigate=useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/roomDetail`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched rooms:', data);
        setRooms(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to load rooms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user || user === "user") {
      navigate("/login");
      return;
    }

    fetchRooms();
  }, [navigate]);
  
  if (loading) {
    return (
      <>
        <LoginNav/>
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading rooms...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <LoginNav/>
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LoginNav/>
      <div className="centers">
        <h3>Welcome {localStorage.getItem("user")}</h3>
      </div>

      <div className="container mt-4">
        {rooms.length === 0 ? (
          <div className="alert alert-info">
            No rooms are currently available.
          </div>
        ) : (
          <div className="row">
            {rooms.map((room) => (
              <div className="col-lg-4 mb-4" key={room._id}>
                <Room 
                  RoomNumber={room.RoomNumber}
                  floor={room.floor}
                  freerooms={room.FreeRooms}
                  roomrent={room.RoomRent}
                  roomFeatures={room.roomFeatures || "Basic Amenities"}
                  description={room.roomDescription || "Standard Room"}
                  ac={room.ac || false}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MainPage;