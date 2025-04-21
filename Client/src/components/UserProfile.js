import React from 'react';
import { UserContext } from './UserContext';
import { useContext, useState, useEffect } from 'react';
import LoginNav from "./LoginNav";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const { value, setValue } = useContext(UserContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    BookedRoomNo: "",
    AmountPaid: "",
    TimePeriod: "",
    checkInDate: ""
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const email = localStorage.getItem("user");
        console.log("Stored email:", email); // Debug log

        if (!email || email === "user") {
          console.log("No valid email found in localStorage");
          navigate("/Login");
          return;
        }

        console.log("Fetching details for email:", email); // Debug log

        const res = await fetch("http://localhost:8000/userDetail", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ email })
        });

        console.log("Response status:", res.status); // Debug log

        const data = await res.json();
        console.log("Response data:", data); // Debug log

        if (!res.ok) {
          throw new Error(data.message || `Server returned ${res.status}: ${data.error || 'Unknown error'}`);
        }

        if (!data.success) {
          throw new Error(data.message || "Server returned unsuccessful response");
        }

        if (!data.user) {
          throw new Error("No user data received from server");
        }

        // Get booking details from localStorage
        const storedRoomNo = localStorage.getItem("BookedRoomNo");
        const storedAmount = localStorage.getItem("AmountPaid");
        const storedPeriod = localStorage.getItem("TimePeriod");
        const storedCheckInDate = localStorage.getItem("checkInDate");

        console.log("Stored booking details:", {
          roomNo: storedRoomNo,
          amount: storedAmount,
          period: storedPeriod,
          checkInDate: storedCheckInDate
        });

        setUserDetails({
          name: data.user.name || "Not provided",
          email: data.user.email || "Not provided",
          mobile: data.user.mobile || "Not provided",
          BookedRoomNo: storedRoomNo || (data.user.BookedRoomNo > 0 ? data.user.BookedRoomNo.toString() : "Not booked"),
          AmountPaid: parseInt(storedAmount) || data.user.AmountPaid || 0,
          TimePeriod: storedPeriod 
            ? `${storedPeriod} months`
            : data.user.TimePeriod > 0 
              ? `${data.user.TimePeriod} months` 
              : 'No active booking',
          checkInDate: storedCheckInDate 
            ? new Date(storedCheckInDate).toLocaleDateString('en-IN')
            : data.user.checkInDate 
              ? new Date(data.user.checkInDate).toLocaleDateString('en-IN')
              : "Not checked in"
        });

        // Log the data sources for debugging
        console.log("Data sources:", {
          fromServer: {
            BookedRoomNo: data.user.BookedRoomNo,
            AmountPaid: data.user.AmountPaid,
            TimePeriod: data.user.TimePeriod,
            checkInDate: data.user.checkInDate
          },
          fromLocalStorage: {
            BookedRoomNo: localStorage.getItem("BookedRoomNo"),
            AmountPaid: localStorage.getItem("AmountPaid"),
            TimePeriod: localStorage.getItem("TimePeriod"),
            checkInDate: localStorage.getItem("checkInDate")
          }
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError(error.message || "Failed to load user details. Please try logging in again.");
        
        // If there's an authentication error, redirect to login
        if (error.message.includes("401") || error.message.includes("403")) {
          localStorage.removeItem("user");
          navigate("/Login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  if (loading) {
    return (
      <>
        <LoginNav />
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading user details...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LoginNav />
      <div className="container mt-5">
        {error ? (
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Profile</h4>
            <p>{error}</p>
            <hr />
            <p className="mb-0">
              Please try <button className="btn btn-link p-0" onClick={() => window.location.reload()}>refreshing the page</button> or <button className="btn btn-link p-0" onClick={() => navigate("/Login")}>logging in again</button>.
            </p>
          </div>
        ) : (
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">My Profile</h3>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-3"><strong>Name:</strong></div>
                <div className="col-md-9">{userDetails.name}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3"><strong>Email:</strong></div>
                <div className="col-md-9">{userDetails.email}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3"><strong>Mobile:</strong></div>
                <div className="col-md-9">{userDetails.mobile}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3"><strong>Room Number:</strong></div>
                <div className="col-md-9">{userDetails.BookedRoomNo}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3"><strong>Amount Paid:</strong></div>
                <div className="col-md-9">₹{typeof userDetails.AmountPaid === 'number' ? userDetails.AmountPaid.toLocaleString('en-IN') : '0'}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3"><strong>Booking Duration:</strong></div>
                <div className="col-md-9">{userDetails.TimePeriod}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-3"><strong>Check-in Date:</strong></div>
                <div className="col-md-9">{userDetails.checkInDate}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;