import React from 'react'
import {useState} from 'react'
import { UserContext } from './UserContext';
import { DetailsContext } from './DetailsContext';
import {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import LoginNav from './LoginNav';

function Renewal() { // i get room details through Props here

  const navigate=useNavigate();
  const {Detail,setDetail}=useContext(DetailsContext); //room details : roomNumber, fees
  const {value,setValue}=useContext(UserContext);  //user Details : user email
  const [month,setMonth]=useState(1); // how many months fee paid

  const [Data,setData]=useState({
      cardNumber:"",
      CVV:"",
    })

  
    function valueSetter(e)
    {
      const name=e.target.name;
      const value=e.target.value;
      setData({...Data, [name]: value});
    }

    const setter=(e)=>{
      setMonth(e.target.value)
  }

var amount=Detail.feeAmount*month
const sendData={
    name:value,
    BookedRoomNo:Detail.RoomNumber,
    AmountPaid:amount,
    TimePeriod:month
}
   async function SendData(e){
      e.preventDefault();

      const res= await fetch("/feerenewal",{
          method:"POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify(sendData)
        
        });
        
        const data= await res.json();
        if(data){
          console.log(data,"success bro")
        navigate('/success');
        }else{
          console.log("error in catch")
        }

  }

  const username=localStorage.getItem("user")
  if(username==="user"){
    navigate("/Login");
  }

return (
<>
<LoginNav/>
  <div class="container">
    
    <div>
<h1>Make Payment to Renew Your account...</h1>
</div>
<form onSubmit={SendData}>
<div class="mb-3">
  <label for="exampleInputEmail1" class="form-label">Room Number</label>
  <input type="text" class="form-control" id="exampleInputEmail1" name="roomNumber" placeholder={localStorage.getItem("BookedRoomNo")} value={localStorage.getItem("BookedRoomNo")} aria-describedby="emailHelp" disabled/>
</div>
<div class="mb-3">
  <label for="exampleInputPassword1" class="form-label">Total Months</label>
  <input type="number"  onChange={setter} name="AmountPaid" value={month} class="form-control" id="exampleInputPassword1"/>
</div>
<div class="mb-3">
  <label for="exampleInputPassword1" class="form-label">Amount</label>
  <input type="number"  name="AmountPaid" placeholder={localStorage.getItem("AmountPaid")} value={localStorage.getItem("AmountPaid")*month} class="form-control" id="exampleInputPassword1" disabled/>
</div>
<div class="mb-3">
  <label for="exampleInputPassword1" class="form-label">Card Number</label>
  <input type="number" onChange={valueSetter} name="cardNumber" value={Data.cardNumber} class="form-control" id="exampleInputPassword1"/>
</div>
<div class="mb-3">
  <label for="exampleInputPassword1" class="form-label">CVV</label>
  <input type="number"  onChange={valueSetter} name="CVV" value={Data.CVV} class="form-control" id="exampleInputPassword1"/>
</div>

<div className='d-flex justify-content-center'>

    {value!=="user"?<button type="submit" class="btn btn-primary">Renew</button>:<button type="submit" class="btn btn-primary" disabled>Renew</button>} 

</div>


</form>

  </div>
  </>
)
}


export default Renewal
