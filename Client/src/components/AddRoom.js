import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from './AdminNav';

const API_BASE_URL = "http://localhost:8000";

const AddRoom = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const [roomData, setRoomData] = useState({
        RoomNumber: "",
        floor: "",
        RoomRent: "",
        roomCapacity: "1",
        FreeRooms: "",
        roomDescription: "",
        roomFeatures: "",
        ac: false
    });

    // Check if user is admin
    useEffect(() => {
        const checkAdmin = () => {
            try {
                const userType = localStorage.getItem("userType");
                const user = localStorage.getItem("user");
                
                console.log("Current userType:", userType);
                console.log("Current user:", user);
                
                if (userType === "admin" && user === "admin@gmail.com") {
                    console.log("Admin authentication successful");
                    setIsAdmin(true);
                } else {
                    console.log("Not authenticated as admin, redirecting to login");
                    localStorage.clear();
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error checking admin status:", error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAdmin();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newValue = type === 'checkbox' ? checked : value;
        
        // Convert numeric fields to numbers
        if (type === 'number') {
            newValue = value === '' ? '' : Number(value);
        }

        setRoomData(prev => {
            const updated = {
                ...prev,
                [name]: newValue
            };

            // Automatically set FreeRooms equal to roomCapacity when roomCapacity changes
            if (name === 'roomCapacity') {
                updated.FreeRooms = newValue;
            }

            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            // Validate inputs
            if (!roomData.RoomNumber || !roomData.floor || !roomData.RoomRent) {
                setError("Room number, floor, and rent are required");
                return;
            }

            // Validate numeric fields
            if (roomData.RoomRent <= 0) {
                setError("Room rent must be greater than 0");
                return;
            }

            if (roomData.roomCapacity < 1) {
                setError("Room capacity must be at least 1");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/admin/rooms/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(roomData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSuccess("Room added successfully!");
            
            // Clear form
            setRoomData({
                RoomNumber: "",
                floor: "",
                RoomRent: "",
                roomCapacity: "1",
                FreeRooms: "1",
                roomDescription: "",
                roomFeatures: "",
                ac: false
            });

        } catch (error) {
            console.error('Error adding room:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while checking admin status
    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Checking admin authentication...</p>
                </div>
            </div>
        );
    }

    // If not admin and not loading, the useEffect will handle the redirect
    if (!isAdmin) {
        return null;
    }

    return (
        <div>
            <AdminNav />
            <div className="container mt-4">
                <h2 className="text-center mb-4">Add New Room</h2>
                
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="alert alert-success" role="alert">
                        {success}
                    </div>
                )}

                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="RoomNumber" className="form-label">Room Number*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="RoomNumber"
                                    name="RoomNumber"
                                    value={roomData.RoomNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="floor" className="form-label">Floor*</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="floor"
                                    name="floor"
                                    value={roomData.floor}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="RoomRent" className="form-label">Room Rent (per month)*</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="RoomRent"
                                    name="RoomRent"
                                    value={roomData.RoomRent}
                                    onChange={handleInputChange}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="roomCapacity" className="form-label">Room Capacity*</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="roomCapacity"
                                    name="roomCapacity"
                                    value={roomData.roomCapacity}
                                    onChange={handleInputChange}
                                    min="1"
                                    required
                                />
                                <small className="text-muted">Number of beds in the room</small>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="roomDescription" className="form-label">Room Description</label>
                                <textarea
                                    className="form-control"
                                    id="roomDescription"
                                    name="roomDescription"
                                    value={roomData.roomDescription}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="e.g., Spacious room with natural lighting"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="roomFeatures" className="form-label">Room Features</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="roomFeatures"
                                    name="roomFeatures"
                                    value={roomData.roomFeatures}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Attached bathroom, Balcony"
                                />
                            </div>

                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="ac"
                                    name="ac"
                                    checked={roomData.ac}
                                    onChange={handleInputChange}
                                />
                                <label className="form-check-label" htmlFor="ac">Air Conditioned</label>
                            </div>

                            <button 
                                type="submit" 
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? 'Adding Room...' : 'Add Room'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRoom;