import React from 'react';
import { Link, useNavigate } from "react-router-dom";

function AdminNav() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear all authentication data
        localStorage.removeItem("userType");
        localStorage.removeItem("user");
        localStorage.removeItem("BookedRoomNo");
        localStorage.removeItem("AmountPaid");
        // Navigate to home page
        navigate("/");
    };
 
    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/adminHome">HostelManager</Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarSupportedContent" 
                    aria-controls="navbarSupportedContent" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/editUsers">Edit-Users</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/editRoom">Edit-Rooms</Link>
                        </li>           
                        <li className="nav-item">
                            <Link className="nav-link" to="/addRoom">Add-Rooms</Link>    
                        </li>
                        <li className="nav-item">
                            <button 
                                className="nav-link" 
                                onClick={handleLogout}
                                style={{ 
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                LogOut
                            </button>    
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default AdminNav;