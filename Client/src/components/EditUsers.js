import React from 'react'
import AdminNav from './AdminNav';
import {useState,useEffect,useContext} from 'react'
import { UserContext } from './UserContext';
import {useNavigate} from "react-router-dom";

function EditUsers() {

  const [count, setCount] = useState([]);
  const {value,setValue}=useContext(UserContext);

  const navigate=useNavigate();

  const [user,setUser]=useState({
    name:"",
    email:"",
    mobile:""
  });


  useEffect(()=>{
    fetch("/allusers").then(function(response) {
      response.json().then(function(users){
        console.log(users); 
      setCount(users)   
      });
    }).catch(err => console.error(err));
  
  },[])

  const username=localStorage.getItem("user")
  if(username==="user"){
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
      name:user.name,
      email:user.email,
      mobile:user.mobile
    }
    const res= await fetch("/updator",{
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
     email:e.target.value
    }
    const res= await fetch("/deletor",{
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

   <div class="middle">
    <h1>Current Users Details...</h1>
   </div>

    {/* cards */}

    <div className="container">
        <div className='row'>
            
  {
  count.map((i)=>{
    //take room numbers from here "i" and get images of them and send as props to rooms page
    
return(

  <div class="holla col-lg-4">


  <form onSubmit={Editor}>
    <div class="inputs">
      <label for="exampleInputEmail1" class="form-label">Name</label>
      <input type="text" name="name" onChange={valueSetter} placeholder={i.name}   class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
    </div>
    <div class="inputs">
      <label for="exampleInputPassword1" class="form-label">Email</label>
      <input type="email"  name="email" onChange={valueSetter} placeholder={i.email}   class="form-control" id="exampleInputPassword1"/>
    </div>
    <div class="inputs">
      <label for="exampleInputPassword1" class="form-label">Mobile</label>
      <input type="text"  name="mobile" onChange={valueSetter} placeholder={i.mobile}   class="form-control" id="exampleInputPassword1"/>
    </div>
     
    <button type="submit" class="btn btn-primary">Edit</button>
    <button name="email" value={i.email} onClick={Delete} class="btn btn-danger" >Delete</button>
  </form>
  
 
  {/* <p>................................................................................................................................................</p> */}
    </div>

)

  })}
        </div>
    </div>

  
  </>
  )
}


export default EditUsers