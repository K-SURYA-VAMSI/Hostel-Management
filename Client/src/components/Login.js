import React from 'react'
import { useNavigate } from "react-router-dom";
import {useState,useContext} from 'react';
import validator from 'validator'
import NavBar from './NavBar';
import { UserContext } from './UserContext';

const Login = () => {
  const {value,setValue}=useContext(UserContext);
  const navigate = useNavigate();

  const [user,setUser]=useState({
    email:"",
    password:"",
  });

  const [error, setError] = useState("");

  function valueSetter(e) {
    const name=e.target.name;
    const value=e.target.value;
    setUser({...user, [name]: value});
  }

  async function mainFunction(e){
    e.preventDefault();
    setError("");

    try {
      if (!validator.isEmail(user.email)) {
        setError("Please enter a valid email address");
        return;
      }

      if (!validator.isStrongPassword(user.password, {
        minLength: 8, minLowercase: 1,
        minUppercase: 1, minNumbers: 1, minSymbols: 1
      })) {
        setError("Password must be at least 8 characters long and contain uppercase, lowercase, numbers and symbols");
        return;
      }

      // Admin login check
      if(user.email==="admin@gmail.com" && user.password==="Admin@123") {
        console.log("Admin login successful");
        setValue(user.email);
        localStorage.setItem("userType", "admin");
        localStorage.setItem("user", user.email);
        navigate("/adminHome");
        return;
      }

      // Regular user login
      const res = await fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(user)
      });
      
      if (!res.ok) {
        throw new Error("Login failed");
      }

      const data = await res.json();
      if(data) {
        console.log("User login successful");
        setValue(user.email);
        localStorage.setItem("userType", "user");
        localStorage.setItem("user", data.email);
        localStorage.setItem("BookedRoomNo", data.BookedRoomNo);
        localStorage.setItem("AmountPaid", data.AmountPaid);
        navigate('/main');
      } else {
        setError("Invalid credentials");
      }
    } catch(error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    }
  }

  return (
    <div>
      <NavBar/>
      <div className="outside d-flex justify-content-center mt-5">
        <div className="d-flex justify-content-center">
          <form onSubmit={mainFunction} className="row g-3 d-flex justify-content-center">
            {error && (
              <div className="col-md-8">
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              </div>
            )}
            <div className="col-md-8">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                onChange={valueSetter} 
                type="email" 
                name="email" 
                className="form-control" 
                id="email" 
                value={user.email} 
                required
              />
            </div>
            <div className="col-md-8">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                onChange={valueSetter} 
                type="password" 
                name="password" 
                className="form-control" 
                id="password" 
                value={user.password} 
                required
              />
            </div>
            <div className="forbutton">
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">Login</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login