import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000";
axios.defaults.withCredentials = true;

async function login(username, password) {
  const payload = {
    username: username,
    password: password,
  };
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, payload, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}

async function logout() {
  try {
    const response = await axios.post(`${API_BASE_URL}/logout`, {});

    return response?.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
}

async function users() {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the users!", error);
  }
}

async function addUser(username, password, role) {
  const payload = {
    username: username,
    password: password,
    role: role,
  };
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, payload);
    return response.data;
  } catch (error) {
    console.error("There was an error adding the user!", error);
    throw error;
  }
}

async function getBooks() {
  try {
    const response = await axios.get(`${API_BASE_URL}/books`);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the books!", error);
  }
}

async function addBook(title, author, year) {
  const payload = {
    title: title,
    author: author,
    publishing_year: year,
  };
  try {
    const response = await axios.post(`${API_BASE_URL}/books`, payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("There was an error adding the book!", error);
    throw error;
  }
}

async function updateBook(id, title, author, year) {
  const payload = {
    title: title,
    author:author,
    publishing_year: year,
  };
  try {
    const response = await axios.put(`${API_BASE_URL}/update_book/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("There was an error updating the book!", error);
    throw error;
  }
}

async function deleteBook(id) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete_book/${id}`);
    return response.data;
  } catch (error) {
    console.error("There was an error deleting the book!", error);
    throw error;
  }
}

export default { login, logout, users, addUser, getBooks, addBook,updateBook, deleteBook };
