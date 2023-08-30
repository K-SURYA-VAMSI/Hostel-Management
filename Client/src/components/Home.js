import React from 'react'
import NavBar from './NavBar';
import final1 from './final1.jpg'

function Home() {
  return (
    <div>
      <NavBar/>
      <div class="myClass">
        <img src={final1} alt="Not found"   />
        {/* <strong><h1 class="joke" >Hostel Management System</h1></strong> */}
        
    </div>
    <div class="two">
        <h2>This Module helps the users to get better shelter and great user experience</h2>
        <button><a href='/register' className='loginLink'>Get Started</a></button>
    </div>
    </div>
  )
}

export default Home