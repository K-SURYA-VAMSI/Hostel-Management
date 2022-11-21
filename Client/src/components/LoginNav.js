import React from 'react'
import { Outlet, Link } from "react-router-dom";
function LoginNav() {
 
    return (
        <>
        <nav class="navbar navbar-expand-lg bg-light">
      <div class="container-fluid">
        <Link class="navbar-brand">HostelManager</Link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
            <Link class="nav-link" to="/main">Home</Link>
            </li>
            <li class="nav-item">
            <Link class="nav-link" to="/MyDetails">MyProfile</Link>
            </li>
            
            <li class="nav-item">
            <Link class="nav-link" to="/renewal">Renewal</Link>
              
            </li>

            <li class="nav-item">
            <Link class="nav-link" to="/">Logout</Link>
              
            </li>
          </ul>
      
        </div>
      </div>
    </nav>
    </>
  )
}

export default LoginNav