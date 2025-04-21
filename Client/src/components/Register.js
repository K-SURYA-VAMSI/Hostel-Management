import { useNavigate } from "react-router-dom";
import {useState} from 'react';
import validator from 'validator'
import NavBar from './NavBar';
function Register(){
  const navigate = useNavigate();
  const [user,setUser]=useState({
    name:"",
    email:"",
    password:"",
    mobile:"",
    aadarCard:"",
    panCard:""
  });

function valueSetter(e)
{
  const name=e.target.name;
  let value=e.target.value;

  // Remove any non-numeric characters for mobile and aadarCard
  if (name === 'mobile' || name === 'aadarCard') {
    value = value.replace(/\D/g, '');
  }

  setUser({...user, [name]: value});
}


async function mainFunction(e){
  e.preventDefault();

  try {
    // Validate name
    if (!user.name || user.name.trim().length < 2) {
      alert("Please enter a valid name (at least 2 characters)");
      return;
    }

    // Validate email
    if (!validator.isEmail(user.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Validate password
    if (!validator.isStrongPassword(user.password, {
      minLength: 8, minLowercase: 1,
      minUppercase: 1, minNumbers: 1, minSymbols: 1
    })) {
      alert("Password must be at least 8 characters long and contain uppercase, lowercase, numbers and symbols");
      return;
    }

    // Validate mobile number
    if (!user.mobile || user.mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    // Validate Aadhar card
    if (!user.aadarCard || user.aadarCard.length !== 12) {
      alert("Please enter a valid 12-digit Aadhar Card Number");
      return;
    }

    // Validate PAN card (optional but if provided should be valid)
    if (user.panCard && !validator.matches(user.panCard.toUpperCase(), /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
      alert("Please enter a valid PAN card number (e.g., ABCDE1234F)");
      return;
    }

    // All validations passed, proceed with registration
    console.log("Attempting registration...");

    const res = await fetch("http://localhost:8000/register", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        ...user,
        mobile: user.mobile,
        aadarCard: user.aadarCard,
        panCard: user.panCard ? user.panCard.toUpperCase() : user.panCard
      })
    });
    
    const data = await res.json();
    console.log("Server response:", data);

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    if (data.success) {
      alert("Registration successful! Please login.");
      navigate('/Login');
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("Registration failed. Please try again.");
  }
}

    return(   
     
        <div >

<NavBar/>
<div class="outside">
<div class='container'>
<form onSubmit={mainFunction} class="row g-3 mt-4" style={{display:"flex",justifyContent:"center"}}>
<div class="col-md-8">
    <label for="name" class="form-label">Name</label>
    <input onChange={valueSetter} type="text" name="name" class="form-control" id="name" value={user.name} required/>
  </div>
  <div class="col-md-8">
    <label for="email" class="form-label">Email</label>
    <input onChange={valueSetter} type="email" name="email" class="form-control" id="email" value={user.email} required/>
  </div>
  <div class="col-md-8">
    <label for="password" class="form-label">Password</label>
    <input onChange={valueSetter} type="password" name="password" class="form-control" id="password" value={user.password} required/>
  </div>
  <div class="col-md-8">
    <label for="mobile" class="form-label">Mobile Number</label>
    <input onChange={valueSetter} type="text" name="mobile" class="form-control" id="mobile" value={user.mobile} required/>
  </div>
  <div class="col-md-8">
    <label for="aadarCard" class="form-label">Aadhar Card</label>
    <input onChange={valueSetter} type="text" name="aadarCard" class="form-control" id="aadarCard" value={user.aadarCard} required/>
  </div>
  <div class="col-md-8">
    <label for="panCard" class="form-label">Pan Card</label>
    <input onChange={valueSetter} type="text" name="panCard" class="form-control" id="panCard" value={user.panCard}/>
  </div>
  <div class="forbutton  d-flex justify-content-center">
  <div class="col-md-8 d-flex justify-content-center">
    <button type="submit" class="btn btn-primary">Register</button>
  </div>
  </div>
</form>
</div>
</div>

        </div>   
        
        
       
    );
}

export default Register;