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
  const value=e.target.value;
  setUser({...user, [name]: value});
}


async function mainFunction(e){
  e.preventDefault();

  // validating the inputs , if ok sending to server
  if (validator.isStrongPassword(user.password, {
    minLength: 8, minLowercase: 1,
    minUppercase: 1, minNumbers: 1, minSymbols: 1
  })&&(validator.isEmail(user.email))&&(user.mobile.toString().length>=10)&&(user.aadarCard.toString().length==12))
  {
    const res= await fetch("/register",{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(user)
    
    });
    
    const data= await res.json();
    if(data){
    navigate('/Login');
    }else{
      console.log("error in catch")
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
  else if(user.aadarCard.toString().length<12)
 {
  alert("Enter a Valid Aadar Card Number");

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
    <input onChange={valueSetter} type="text" name="aadarCard" class="form-control" id="aadarCard" value={user.aadharCard} required/>
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