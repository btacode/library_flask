import './App.css';
import Login from '../src/screens/Login/login';
import { Routes, Route } from 'react-router-dom';
import Home from '../src/screens/Home/home';

function App() {
  return (
   <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/home" element={<Home/>} />
   </Routes>
  );
}

export default App;
