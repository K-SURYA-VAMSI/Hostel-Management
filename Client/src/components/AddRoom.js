import React,{useState} from 'react'
import AdminNav from './AdminNav'


function AddRoom(){
  
  const [user,setUser]=useState({
    RoomNumber:"",
    floor:"",
    RoomRent:"",
    roomCapacity:"",
    roomRating:"",
    roomFeatures:"",
    roomDescription:"",
    Ac:true
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
    const res= await fetch("/roomregister",{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(user)
    
    });
    
    const data= await res.json();
    if(data){
    alert("Room Successfully Added")
    }else{
      alert("Failed to add Room")
    }
  }catch(e)
  {
    alert("Unable to Add Room")
  }


 } 
 
    return(   
     
        <div >

<AdminNav/>
<div class="outsides">
<div class='container'>

<form onSubmit={mainFunction} class="row g-3">
<div class="col-md-8">
    <label for="RoomNumber" class="form-label">Room Number</label>
    <input onChange={valueSetter} type="text" name="RoomNumber" class="form-control" id="RoomNumber" value={user.RoomNumber} required/>
  </div>
  <div class="col-md-8">
    <label for="floor" class="form-label">Floor</label>
    <input onChange={valueSetter} type="text" name="floor" class="form-control" id="floor" value={user.floor} required/>
  </div>
  <div class="col-md-8">
    <label for="RoomRent" class="form-label">Rent</label>
    <input onChange={valueSetter} type="text" name="RoomRent" class="form-control" id="RoomRent" value={user.RoomRent} required/>
  </div>
  <div class="col-md-8">
    <label for="roomCapacity" class="form-label">Room Capacity</label>
    <input onChange={valueSetter} type="number" name="roomCapacity" class="form-control" id="roomCapacity" value={user.roomCapacity} required/>
  </div>
  <div class="col-md-8">
    <label for="roomRating" class="form-label">Room Rating</label>
    <input onChange={valueSetter} type="number" name="roomRating" class="form-control" id="roomRating" value={user.roomRating} required/>
  </div>
  <div class="col-md-8">
    <label for="roomDescription" class="form-label">Room Description</label>
    <input onChange={valueSetter} type="text" name="roomDescription" class="form-control" id="roomDescription" value={user.roomDescription} required/>
  </div>
  <div class="col-md-8">
    <label for="roomFeatures" class="form-label">Room Features</label>
    <input onChange={valueSetter} type="text" name="roomFeatures" class="form-control" id="roomFeatures" value={user.roomFeatures}/>
  </div>
  <div class="forbutton">
  <div class="col-12">
    <button type="submit" class="btn btn-primary">Add Room</button>
  </div>
  </div>
</form>
</div>
</div>

        </div>   
        
        
       
    );
}

export default AddRoom;