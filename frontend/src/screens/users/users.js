import React, { useState } from "react";
import "./users.css";

function Users() {
 const users = [
   { id: 1, username: "john_doe", role: "Admin" },
   { id: 2, username: "jane_smith", role: "User" },
 ];
 const [modalIsOpen, setModalIsOpen] = useState(false);

 const [newUsername, setNewUsername] = useState("");
 const [newPassword, setNewPassword] = useState("");
 const [newRole, setNewRole] = useState("User");

 const openModal = () => setModalIsOpen(true);

 const closeModal = () => {
   setModalIsOpen(false);
  //  setNewUsername("");
  //  setNewPassword("");
  //  setNewRole("User");
 };

 return (
   <>
     <div className="container">
       <div className="header">
         <p className="lead">User Management</p>
         <button className="add-button" onClick={openModal}>
           Add User
         </button>
       </div>

       <table className="user-table">
         <thead>
           <tr className="table-header">
             <th>ID</th>  
             <th>Username</th>
             <th>Role</th>
           </tr>
         </thead>
         <tbody>
           {users.map((user) => (
             <tr key={user.id}>
               <td>{user.id}</td>
               <td>{user.username}</td>
               <td>{user.role}</td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>

     {modalIsOpen && (
       <div
         onClick={closeModal}
         style={{
           position: "fixed",
           top: "0",
           left: "0",
           right: "0",
           bottom: "0",
           backgroundColor: "rgba(0, 0, 0, 0.5)",
           zIndex: "10000",
           display: "flex",
           alignItems: "center",
           justifyContent: "center",
         }}
       >
         <div
           onClick={(e) => e.stopPropagation()}
           style={{
             width: "400px",
             maxWidth: "90vw",
             backgroundColor: "white",
             borderRadius: "8px",
             boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
             position: "relative",
             maxHeight: "90vh",
             overflowY: "auto",
           }}
         >
           <div style={{ padding: "20px" }}>
             <h2>Add New User</h2>

             <div>
               <div className="form-group">
                 <label>Username:</label>
                 <input
                   type="text"
                   value={newUsername}
                   onChange={(e) => setNewUsername(e.target.value)}
                   placeholder="Enter username"
                   id="username"
                   name="username"
                   required
                 />
               </div>

               <div className="form-group">
                 <label>Password:</label>
                 <input
                   type="password"
                   id="password"
                   name="password"
                   required
                   placeholder="Enter password"
                   value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)}
                 />
               </div>

               <div className="form-group">
                 <label>Role:</label>
                 <select
                   value={newRole}
                   onChange={(e) => setNewRole(e.target.value)}
                   id="role"
                   name="role"
                 >
                   <option value="User">User</option>
                   <option value="Admin">Admin</option>
                 </select>
               </div>

               <div className="modal-actions">
                 <button className="btn btn-primary" type="submit">
                   Add
                 </button>
                 <button
                   onClick={closeModal}
                   type="button"
                   className="btn-secondary"
                 >
                   Cancel
                 </button>
               </div>
             </div>
           </div>
         </div>
       </div>
     )}
   </>
 );
}

export default Users;

