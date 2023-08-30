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


function valueSetter(e)
{
  const name=e.target.name;
  const value=e.target.value;
  setUser({...user, [name]: value});
}

async function mainFunction(e){
  e.preventDefault();

  try{
  if (validator.isStrongPassword(user.password, {
    minLength: 8, minLowercase: 1,
    minUppercase: 1, minNumbers: 1, minSymbols: 1
  })&&(validator.isEmail(user.email)))
  {
    
    if(user.email==="admin@gmail.com"&&user.password==="Admin@123") // if login as Admin => redirect to Control Page
    {
      setValue(user.email);
        navigate("/adminHome");
    }
    else
    {

    const res= await fetch("/login",{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(user)
    
    });
    
    const data= await res.json();
    if(data){
      setValue(user.email);
      console.log(data)
      localStorage.setItem("user",data.email);
      localStorage.setItem("BookedRoomNo",data.BookedRoomNo);
      localStorage.setItem("AmountPaid",data.AmountPaid);
      
    navigate('/main');
    }else{
      alert("Enter correct password")
    }
  }
    
  }
  else if(!validator.isStrongPassword(user.password, {
    minLength: 8, minLowercase: 1,
    minUppercase: 1, minNumbers: 1, minSymbols: 1
  }))
  {
    alert("Enter a Strong Password");  
  }
  else if(!validator.isEmail(user.email))
  {
   alert("Enter valid email address");
  }


}
catch(error){
  alert("InCorrect Data")
}
}


  return (
    <div>


<NavBar/>
<div class="outside d-flex justify-content-center mt-5">
  <div class="d-flex justify-content-center">
  
<form onSubmit={mainFunction} class="row g-3 d-flex justify-content-center">

  <div class="col-md-8">
    <label for="email" class="form-label">Email</label>
    <input onChange={valueSetter} type="email" name="email" class="form-control" id="email" value={user.email} required/>
  </div>
  <div class="col-md-8">
    <label for="password" class="form-label">Password</label>
    <input onChange={valueSetter} type="password" name="password" class="form-control" id="password" value={user.password} required/>
  </div>
  <div class="forbutton">
  <div class="d-flex justify-content-center">
    <button type="submit" class="btn btn-primary">Login</button>
    </div>
  </div>
</form>
</div>
</div>
</div>


  )
}

export default Login