import React, { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import { DetailsContext } from './DetailsContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginNav from './LoginNav';

const API_BASE_URL = "http://localhost:8000";

function Payment() {
    const navigate = useNavigate();
    const { Detail } = useContext(DetailsContext);
    const { value } = useContext(UserContext);
    const [month, setMonth] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [paymentData, setPaymentData] = useState({
        cardNumber: "",
        CVV: "",
        expiryDate: "",
    });

    // Check if we have room details
    useEffect(() => {
        if (!Detail || !Detail.RoomNumber) {
            navigate('/main');
        }
    }, [Detail, navigate]);

    // Check if user is logged in
    useEffect(() => {
        const user = localStorage.getItem("user");
        const email = localStorage.getItem("email") || user; // Get email from localStorage or use user as fallback
        
        if (!email || email === "user") {
            navigate("/login");
            return;
        }

        // Store email in localStorage if not already there
        if (!localStorage.getItem("email")) {
            localStorage.setItem("email", email);
        }
    }, [navigate]);

    function handleInputChange(e) {
        const { name, value } = e.target;
        setPaymentData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleMonthChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= 12) {
            setMonth(value);
        }
    };

    const amount = Detail?.feeAmount * month;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Validate card details
            if (!validateCardDetails()) {
                setError("Please check your card details");
                setLoading(false);
                return;
            }

            // Get user email from localStorage
            const userEmail = localStorage.getItem("email") || localStorage.getItem("user");
            if (!userEmail || userEmail === "user") {
                setError("User not logged in");
                setLoading(false);
                return;
            }

            const response = await fetch("http://localhost:8000/feePayment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userEmail,
                    AmountPaid: parseFloat(amount),
                    BookedRoomNo: Detail.RoomNumber,
                    TimePeriod: parseInt(month),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Payment failed");
            }

            if (data.success) {
                // Update localStorage with booking details
                localStorage.setItem("roomNumber", data.bookingDetails.roomNumber);
                localStorage.setItem("checkInDate", data.bookingDetails.checkInDate);
                localStorage.setItem("Active", "true");
                localStorage.setItem("BookedRoomNo", data.bookingDetails.roomNumber);
                localStorage.setItem("AmountPaid", data.bookingDetails.amount);

                setSuccess(true);
                setSuccessMessage("Payment successful! Room booked successfully.");
                setTimeout(() => {
                    navigate("/dashboard");
                }, 2000);
            } else {
                throw new Error(data.error || "Payment failed");
            }
        } catch (error) {
            console.error("Payment error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const validateCardDetails = () => {
        // Card number validation (16 digits)
        if (!/^\d{16}$/.test(paymentData.cardNumber)) {
            return false;
        }

        // CVV validation (3 or 4 digits)
        if (!/^\d{3,4}$/.test(paymentData.CVV)) {
            return false;
        }

        // Expiry date validation (MM/YY format)
        if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(paymentData.expiryDate)) {
            return false;
        }

        const [month, year] = paymentData.expiryDate.split("/");
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        // Check if card is not expired
        if (parseInt(year) < currentYear || 
            (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            return false;
        }

        return true;
    };

    if (!Detail || !Detail.RoomNumber) {
        return (
            <>
                <LoginNav />
                <div className="container mt-5">
                    <div className="alert alert-warning">
                        Please select a room first.
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <LoginNav />
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="card-title text-center mb-4">Room Booking Payment</h3>
                                
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success" role="alert">
                                        {successMessage}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Room Number</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={Detail.RoomNumber} 
                                            disabled
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Number of Months</label>
                                        <input 
                                            type="number"
                                            className="form-control"
                                            value={month}
                                            onChange={handleMonthChange}
                                            min="1"
                                            max="12"
                                            required
                                        />
                                        <small className="text-muted">Maximum 12 months</small>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Total Amount</label>
                                        <input 
                                            type="text"
                                            className="form-control"
                                            value={`₹${amount}/-`}
                                            disabled
                                        />
                                        <small className="text-muted">Monthly rent × Number of months</small>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Card Number</label>
                                        <input 
                                            type="text"
                                            className="form-control"
                                            name="cardNumber"
                                            value={paymentData.cardNumber}
                                            onChange={handleInputChange}
                                            maxLength="16"
                                            placeholder="1234 5678 9012 3456"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">CVV</label>
                                        <input 
                                            type="password"
                                            className="form-control"
                                            name="CVV"
                                            value={paymentData.CVV}
                                            onChange={handleInputChange}
                                            maxLength="3"
                                            placeholder="123"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Expiry Date</label>
                                        <input 
                                            type="text"
                                            className="form-control"
                                            name="expiryDate"
                                            value={paymentData.expiryDate}
                                            onChange={handleInputChange}
                                            placeholder="MM/YY"
                                            required
                                        />
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : `Pay ₹${amount}/-`}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Payment;
