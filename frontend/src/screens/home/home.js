import React from 'react';
import { useSelector } from 'react-redux';

const Home = () =>{ 
  const {userData} = useSelector((state) => state.auth);
  return(
  <h1>
    Welcome to the Home Page {userData?.username}
  </h1>
);}

export default Home;