import React from 'react';
import { UserContext } from './UserContext';
import {useContext,useState,useEffect} from 'react';
import LoginNav from "./LoginNav";
import {useNavigate} from "react-router-dom";

const UserProfile=()=> {
  const navigate=useNavigate();
const {value,setValue}=useContext(UserContext);
const [content,setContent]=useState({
  name:"",
  email:"",
  mobile:"",
  BookedRoom:"",
  AmountPaid:"",
  TimePeriod:"",
  checkInDate:""
});

const [user,setUser]=useState({
  name:"",
  email:"",
  mobile:"",
  BookedRoom:"",
  AmountPaid:"",
  TimePeriod:"",
  checkInDate:""
});

const username=localStorage.getItem("user")
if(username==="user"){
  navigate("/Login");
}
const userdata={
    email:localStorage.getItem("user")
}

useEffect(()=>{
  
  async function mainFunction(){
    const res= await fetch("/userDetail",{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(userdata)
    
    });
  
    const data= await res.json();
    if(data){
       const xyz={
        name:data.name,
        email:data.email,
        mobile:data.mobile,
        BookedRoom:data.BookedRoom,
        AmountPaid:data.AmountPaid,
        TimePeriod:data.TimePeriod,
        checkInDate:data.checkInDate
      }
     
      setContent(content=>{ return{...content,...xyz}});
    
    }else{
      console.log("error in catch")
    }
  
  }
mainFunction();

},[])

//  value setter
function valueSetter(e)
{
  const name=e.target.name;
  const value=e.target.value;
  setUser({...user, [name]: value});
}

// send to Db
async function Sender(e){
e.preventDefault();

const res= await fetch("/userupdate",{
  method:"POST",
  headers: {"Content-Type":"application/json"},
  body: JSON.stringify(user)

});

const data= await res.json();
if(data){
  alert("Details Updated")
}else{
  console.log("error in catch")
}


}

  return (
    <>
    <LoginNav/>
    <div class="container">
<div class="update"><h2>Update Details... </h2></div>
    <form onSubmit={Sender} >
    <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Name </label>
    <input type="text" onChange={valueSetter} name="name" value={user.name} placeholder={content.name} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
  </div>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" onChange={valueSetter} name="email" value={user.email} placeholder={content.email} class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Mobile Number</label>
    <input type="text" onChange={valueSetter} name="mobile" value={user.mobile} placeholder={content.mobile} class="form-control" id="exampleInputPassword1"/>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">BookedRoom Number</label>
    <input type="text" onChange={valueSetter} name="BookedRoom" value={content.BookedRoom} class="form-control" id="exampleInputPassword1" disabled/>
  </div>

  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Booked Months</label>
    <input type="text" onChange={valueSetter} name="TimePeriod" value={content.TimePeriod} class="form-control" id="exampleInputPassword1" disabled/>
  </div>

  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">CheckInDate</label>
    <input type="text" name="checkInDate" value={content.checkInDate} class="form-control" id="exampleInputPassword1" disabled/>
  </div>
 
 <div className='d-flex justify-content-center'>
  <button type="submit" class="btn btn-primary ">Update</button>

 </div>
</form>

    </div>
    </>
  )
}

export default UserProfile