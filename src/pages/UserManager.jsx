import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('staff');
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      Swal.fire("Error!", "Failed to fetch users.", "error");
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
  
    // Check if the username already exists
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      Swal.fire('Error!', 'Username already exists. Please choose a different one.', 'error');
      return; // Stop the function if the username is already taken
    }
  
    try {
      const token = localStorage.getItem("token"); // Ambil token dari localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      if (editingUser) {
        // Update user
        await axios.patch(`http://localhost:5000/admin/users/${editingUser.id}`, { username, password, role }, config);
        Swal.fire('Updated!', 'User has been updated.', 'success');
      } else {
        // Add new user
        await axios.post('http://localhost:5000/admin/users', { username, password, role }, config);
        Swal.fire('Added!', 'User has been added.', 'success');
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      Swal.fire('Error!', 'There was an error saving the user.', 'error');
    }
  };
  

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUsername(user.username);
    setRole(user.role);
    setPassword(''); // kosongkan kolom password saat edit
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
        fetchUsers();
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete user.', 'error');
      }
    }
  };

  const resetForm = () => {
    setEditingUser(null);
    setUsername('');
    setPassword('');
    setRole('staff');
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-semibold mb-8 text-black">User Management</h1>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="bg-indigo-600 text-white px-6 py-2 rounded-full shadow-md mb-6 hover:bg-indigo-700"
      >
        + Add User
      </button>

      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="px-6 py-3 text-left text-black font-medium">Username</th>
              <th className="px-6 py-3 text-left text-black font-medium">Role</th>
              <th className="px-6 py-3 text-right text-black font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-black">{user.username}</td>
                <td className="px-6 py-4 text-black">{user.role}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => handleEditUser(user)} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user.id)} 
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-black">{editingUser ? 'Edit User' : 'Add User'}</h2>
            <form onSubmit={handleSaveUser}>
              <div className="mb-5">
                <label className="block text-black font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 bg-gray-50 text-black"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-black font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 bg-gray-50 text-black"
                    required
                    autoComplete={editingUser ? "current-password" : "new-password"} // Sesuai konteks
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-black font-medium mb-2">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-600 bg-gray-50 text-black"
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
