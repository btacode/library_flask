import axios from 'axios'

axios.defaults.withCredentials = true; // Enable sending cookies with requests

async function login(username,password){
    const payload = {
        username:username,
        password:password
    }
    try{
        const response = await axios.post("http://127.0.0.1:5000/login",payload,{
            withCredentials: true,
        });
        return response?.data
        
    }catch(error){
        console.error("Login failed:", error);
        throw error;
    }
}

async function logout() {
    try{
        const response = await axios.post("http://127.0.0.1:5000/logout",{});
        
        return response?.data;
    }catch(error){
        console.error("Logout failed:", error);
        throw error;
    }
}



export default {login,logout}