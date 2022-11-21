import React from 'react'
import AdminNav from './AdminNav';
import final1 from './final1.jpg'

function AdminHome() {
 
  return (
    <>
    <AdminNav/>
    <div class="myClass">
        <img src={final1} alt="Not found" />
        {/* <strong><h1 class="joke" >Hostel Management System</h1></strong> */}
        
    </div>
    
    </>
  )
}

export default AdminHome