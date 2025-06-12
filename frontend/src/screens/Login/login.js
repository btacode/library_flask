import React from 'react'
import './login.css';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
  return (
   <div className='form-container'>
    <h2>Welcome to the Login Page</h2>
    <div className='card'>
        <form>
          <div className='form-group'>
            <label htmlFor='username'>Username</label>
            <input type='text' id='username' name='username' required />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' name='password' required />
          </div>
          <button type='submit' onClick={()=>{navigate('/home')}}>Login</button>
          </form>
    </div>
   </div>
  )
}
