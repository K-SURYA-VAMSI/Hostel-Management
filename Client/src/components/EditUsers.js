import React from 'react'
import AdminNav from './AdminNav';
import {useState,useEffect,useContext} from 'react'
import { UserContext } from './UserContext';
import {useNavigate} from "react-router-dom";

function EditUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {value,setValue}=useContext(UserContext);
  const navigate=useNavigate();

  const [user,setUser]=useState({
    name:"",
    email:"",
    mobile:""
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/admin/users');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched users:', data);
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const username=localStorage.getItem("user")
  if(username==="user"){
    navigate("/Login");
  }
  
  function valueSetter(e) {
    const name=e.target.name;
    const value=e.target.value;
    setUser({...user, [name]: value});
  }
   
  async function updateUser(e){
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/admin/users/update', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          userId: e.target.dataset.userid,
          updates: user
        })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if(data) {
        alert("Details successfully changed");
        // Refresh the users list
        const response = await fetch('http://localhost:8000/admin/users');
        const updatedUsers = await response.json();
        setUsers(updatedUsers);
      } else {
        alert("Failed to update user");
      }
    } catch(error) {
      console.error('Error updating user:', error);
      alert(`Error updating user: ${error.message}`);
    }
  }

  async function deleteUser(e){
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/admin/users/delete', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          userId: e.target.dataset.userid
        })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if(data) {
        alert("User deleted successfully");
        // Refresh the users list
        const response = await fetch('http://localhost:8000/admin/users');
        const updatedUsers = await response.json();
        setUsers(updatedUsers);
      } else {
        alert("Failed to delete user");
      }
    } catch(error) {
      console.error('Error deleting user:', error);
      alert(`Error deleting user: ${error.message}`);
    }
  }

  if (loading) {
    return (
      <>
        <AdminNav/>
        <div className="container mt-5">
          <h2 className="text-center">Loading users...</h2>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminNav/>
        <div className="container mt-5">
          <div className="alert alert-danger" role="alert">
            Error loading users: {error}
            <br/>
            Please make sure:
            <ul>
              <li>MongoDB is running</li>
              <li>The server is running on port 8000</li>
              <li>You are logged in as admin</li>
            </ul>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNav/>
      <div className="middle">
        <h1>Current Users Details...</h1>
        {users.length === 0 ? (
          <div className="alert alert-info mt-4" role="alert">
            No users found. Users will appear here once registered.
          </div>
        ) : (
          <div className="container">
            <div className='row'>
              {users.map((user) => (
                <div className="holla col-lg-4" key={user._id}>
                  <form onSubmit={updateUser} data-userid={user._id}>
                    <div className="inputs">
                      <label className="form-label">Name</label>
                      <input type="text" name="name" onChange={valueSetter} placeholder={user.name} className="form-control"/>
                    </div>
                    <div className="inputs">
                      <label className="form-label">Email</label>
                      <input type="email" name="email" onChange={valueSetter} placeholder={user.email} className="form-control"/>
                    </div>
                    <div className="inputs">
                      <label className="form-label">Mobile</label>
                      <input type="text" name="mobile" onChange={valueSetter} placeholder={user.mobile} className="form-control"/>
                    </div>
                    <button type="submit" className="btn btn-primary">Edit</button>
                    <button onClick={deleteUser} data-userid={user._id} className="btn btn-danger">Delete</button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default EditUsers;