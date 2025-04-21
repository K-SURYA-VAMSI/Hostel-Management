import React from 'react'
import AdminNav from './AdminNav';
import {useState, useEffect, useContext} from 'react'
import { UserContext } from './UserContext';
import {useNavigate} from "react-router-dom";

// API base URL
const API_BASE_URL = "http://localhost:8000";

function EditRoom() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {value, setValue} = useContext(UserContext);
  const navigate = useNavigate();
  
  const [roomUpdate, setRoomUpdate] = useState({
    RoomNumber: "",
    floor: "",
    RoomRent: ""
  });

  useEffect(() => {
    // Check authentication
    const userType = localStorage.getItem("userType");
    console.log('Current user type:', userType);
    
    if (userType !== "admin") {
      console.log('Not admin, redirecting to login');
      navigate("/login");
      return;
    }

    // Fetch rooms data
    const fetchRooms = async () => {
      try {
        console.log('Starting to fetch rooms...');
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/admin/rooms`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched rooms:', data);
        setRooms(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [navigate]);

  function handleInputChange(e) {
    const {name, value} = e.target;
    setRoomUpdate(prev => ({...prev, [name]: value}));
  }
   
  async function handleUpdate(e, roomId) {
    e.preventDefault();
    
    // Filter out empty values
    const updates = Object.fromEntries(
      Object.entries(roomUpdate).filter(([_, value]) => value !== "")
    );
    
    if (Object.keys(updates).length === 0) {
      setError("Please fill at least one field to update");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/rooms/update`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomId,
          updates
        })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      alert("Room details updated successfully");
      
      // Reset form
      setRoomUpdate({
        RoomNumber: "",
        floor: "",
        RoomRent: ""
      });
      
      // Refresh the rooms list
      const response = await fetch(`${API_BASE_URL}/admin/rooms`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedRooms = await response.json();
      setRooms(updatedRooms);
      setError(null);
    } catch (error) {
      console.error('Error updating room:', error);
      setError(`Error updating room: ${error.message}`);
    }
  }

  async function handleDelete(e, roomId) {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/rooms/delete`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomId })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      alert("Room deleted successfully");
      
      // Refresh the rooms list
      const response = await fetch(`${API_BASE_URL}/admin/rooms`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedRooms = await response.json();
      setRooms(updatedRooms);
      setError(null);
    } catch (error) {
      console.error('Error deleting room:', error);
      setError(`Error deleting room: ${error.message}`);
    }
  }

  if (loading) {
    return (
      <>
        <AdminNav/>
        <div className="container mt-5">
          <h2 className="text-center">Loading rooms...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNav/>
      <div className="container mt-4">
        <h2 className="text-center mb-4">Manage Rooms</h2>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
            <br/>
            Please make sure:
            <ul>
              <li>The server is running on port 8000</li>
              <li>MongoDB is running and connected</li>
              <li>You are logged in as admin</li>
            </ul>
          </div>
        )}

        {!error && rooms.length === 0 ? (
          <div className="alert alert-info">
            No rooms found. Add rooms using the Add-Rooms option.
          </div>
        ) : (
          <div className="row">
            {rooms.map((room) => (
              <div className="col-lg-4 mb-4" key={room._id}>
                <div className="card">
                  <div className="card-body">
                    <form onSubmit={(e) => handleUpdate(e, room._id)}>
                      <div className="mb-3">
                        <label className="form-label">Room Number</label>
                        <input 
                          type="text" 
                          name="RoomNumber" 
                          onChange={handleInputChange} 
                          placeholder={room.RoomNumber}   
                          className="form-control"
                          value={roomUpdate.RoomNumber}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Floor</label>
                        <input 
                          type="text"  
                          name="floor" 
                          onChange={handleInputChange} 
                          placeholder={room.floor}   
                          className="form-control"
                          value={roomUpdate.floor}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Rent</label>
                        <input 
                          type="text"  
                          name="RoomRent" 
                          onChange={handleInputChange} 
                          placeholder={room.RoomRent}   
                          className="form-control"
                          value={roomUpdate.RoomRent}
                        />
                      </div>
                      <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">Update</button>
                        <button 
                          onClick={(e) => handleDelete(e, room._id)} 
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default EditRoom;