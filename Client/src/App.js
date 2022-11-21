import './App.css';
import Register from './components/Register';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import MainPage from './components/MainPage';
import ErrorPage from './components/ErrorPage';
import Room from './components/Room';
import {UserContext} from './components/UserContext';
import {DetailsContext} from './components/DetailsContext';
import {useState} from 'react';
import Payment from './components/Payment';
import SuccessPage from './components/SuccessPage';
import UserProfile from './components/UserProfile';
import AdminHome from './components/AdminHome';
import EditUsers from './components/EditUsers';
import EditRoom from './components/EditRoom';
import AddRoom from './components/AddRoom';
import Renewal from './components/Renewal';

function App() {
  const [value,setValue]=useState("user");
  const [Detail,setDetail]=useState({})
  return (
    <>
    <BrowserRouter>
    <DetailsContext.Provider value={{Detail,setDetail}}>
    <UserContext.Provider value={{value,setValue}}>
    <Routes>  
      <Route index path="/" element={<Home/>}/>
      <Route index path="/register" element={<Register/>}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/main" element={<MainPage/>}></Route>
      <Route path="/Room" element={<Room/>}></Route>
      <Route path="/Payment" element={<Payment/>}></Route>
      <Route path="/adminHome" element={<AdminHome/>}></Route>
      <Route path="/editUsers" element={<EditUsers/>}></Route>
      <Route path="/editRoom" element={<EditRoom/>}></Route>
      <Route path="/addRoom" element={<AddRoom/>}></Route>
      <Route path="/renewal" element={<Renewal/>}></Route>
      <Route path="/MyDetails" element={<UserProfile/>}></Route>
      <Route path="/success" element={<SuccessPage/>}></Route>
      <Route path="*" element={<ErrorPage/>}></Route>
    </Routes>
    </UserContext.Provider>
    </DetailsContext.Provider>
    </BrowserRouter>      
    </>
  );
}

export default App;
