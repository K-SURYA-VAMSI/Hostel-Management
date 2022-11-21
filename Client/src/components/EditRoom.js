import React from 'react'
import AdminNav from './AdminNav';
import {useState,useEffect,useContext} from 'react'
import { UserContext } from './UserContext';
import {useNavigate} from "react-router-dom";

function EditRoom() {
  const [count, setCount] = useState([]);
  const {value,setValue}=useContext(UserContext);
  const navigate=useNavigate();
  const [user,setUser]=useState({
    RoomNumber:"",
    floor:"",
    rent:""
  });

  useEffect(()=>{ // fetcing rooms details and storing in count array
    fetch("/roomDetail").then(function(response) {
      response.json().then(function(users){
        console.log(users); 
      setCount(users)   
      });
    }).catch(err => console.error(err));
  
  },[])


  if(value==="user"){
    navigate("/Login");
  }


  function valueSetter(e)
{
  const name=e.target.name;
  const value=e.target.value;
  setUser({...user, [name]: value});
}
   

async function Editor(e){
  e.preventDefault();

  try{
    
    const ok={
      RoomNumber:user.RoomNumber,
    floor:user.floor,
    rent:user.rent
    }
    const res= await fetch("/roomupdator",{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(ok)
    
    });
    
    const data= await res.json();
    if(data){
     alert("Details successfully changed")
   
    }else{
      alert("Enter correct Details")
    }
 
  
}
catch(error){
  alert("No matching Data")
}
}



async function Delete(e){
  e.preventDefault();

  try{
    
    const ok={
     RoomNumber:e.target.value
    }
    const res= await fetch("/roomdeletor",{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(ok)
    
    });
    
    const data= await res.json();
    if(data){
      
     alert("Deletion Successful")
   
    }else{
      alert("Enter correct Details")
    }
 
  
}
catch(error){
  alert("No matching Data")
}
}

  
  return (
   <>
   
   <AdminNav/>

    <div className='container'>
        <div className="row">
        {

count.map((i)=>{
  //take room numbers from here "i" and get images of them and send as props to rooms page
return(
<>

<div class="col-lg-4 holla">

<form onSubmit={Editor}>
<div class="inputs">
  <label for="exampleInputEmail1" class="form-label">Room Number</label>
  <input type="text" name="RoomNumber" onChange={valueSetter} placeholder={i.RoomNumber}   class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
</div>
<div class="inputs">
  <label for="exampleInputPassword1" class="form-label">floor</label>
  <input type="text"  name="floor" onChange={valueSetter} placeholder={i.floor}   class="form-control" id="exampleInputPassword1"/>
</div>
<div class="inputs">
  <label for="exampleInputPassword1" class="form-label">Rent</label>
  <input type="text"  name="rent" onChange={valueSetter} placeholder={i.RoomRent}   class="form-control" id="exampleInputPassword1"/>
</div>
 
<button type="submit" class="btn btn-primary">Edit</button>
<button name="RoomNumber" value={i.RoomNumber} onClick={Delete} class="btn btn-danger">Delete</button>
</form>








</div>

</>
)

})}

        </div>
    </div>
  </>
  )
}

export default EditRoom