import React from 'react'
import LoginNav from './LoginNav';
import Room from './Room';
import {useState,useEffect,useContext} from 'react'
import { UserContext } from './UserContext';
import {useNavigate} from "react-router-dom";

function MainPage() {
  const [count, setCount] = useState([]);
  const {value,setValue}=useContext(UserContext);
  const navigate=useNavigate();

  const username=localStorage.getItem("user")
  if(username==="user"){
    navigate("/Login");
  }

  useEffect(()=>{
    fetch("/roomDetail").then(function(response) {
      response.json().then(function(users){
        console.log(users); 
      setCount(users)   
      });
    }).catch(err => console.error(err));
  
  },[])

  console.log(localStorage.getItem("user"))
  
  return (
   <>

   <LoginNav/>

   <div class="centers">
    <h3>Welcome {localStorage.getItem("user")}</h3>
   </div>

    <br/>

    <div className="container">
        <div className="row">
            
  {
    
count.map((i)=>{
  //take room numbers from here "i" and get images of them and send as props to rooms page
return(
<div className='col-lg-4'>
<Room RoomNumber={i.RoomNumber} 
floor={i.floor}
freerooms={i.FreeRooms}
roomrent={i.RoomRent}
roomFeatures={i.roomFeatures}
description={i.roomDescription}
/>

</div>
)

})}
        </div>
    </div>
  
  </>
  )
}

export default MainPage