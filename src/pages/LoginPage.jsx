import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

const LoginPage = ({ setRole }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nik, setNik] = useState("");
  const [clientData, setClientData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchErrorMessage, setSearchErrorMessage] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isSearchResultVisible, setIsSearchResultVisible] = useState(false);
  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", username); 
      setRole(response.data.role);
      navigate("/"); // Redirect to Dashboard
    } catch (error) {
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  // Handle NIK search
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchErrorMessage("");

    try {
      const response = await axios.get(
        `http://localhost:5000/clients/nik/${nik}`
      );
      if (response.data) {
        setClientData([response.data]);
        setIsSearchResultVisible(true);
      } else {
        setSearchErrorMessage("Data tidak ditemukan");
        setClientData([]);
      }
    } catch (error) {
      setSearchErrorMessage(
        "Terjadi kesalahan saat mencari data. Silakan coba lagi."
      );
    }
  };

  const closeSearchResult = () => {
    setIsSearchResultVisible(false);
  };

  return (
    <div className="flex items-center justify-center bg-blue-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          {isLoginForm ? "Login" : "Search Berkas"}
        </h2>

        {/* Error Message */}
        {(errorMessage || searchErrorMessage) && (
          <div className="mb-4 text-red-500 text-center">
            {isLoginForm ? errorMessage : searchErrorMessage}
          </div>
        )}

        {/* Form */}
        {isLoginForm ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-lg focus:bg-gray-100"
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-lg focus:bg-gray-100"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
            <p className="text-black text-center mt-4 ">
              or
            </p>
          </form>
        ) : (
          <form onSubmit={handleSearch}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="nik">
                NIK
              </label>
              <input
                type="text"
                id="nik"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="w-full px-4 py-2 bg-white text-black border border-gray-300 rounded-lg focus:bg-gray-100"
                placeholder="Masukkan NIK"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faSearch} /> Search
            </button>
          </form>
        )}

        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setIsLoginForm(!isLoginForm)}
          className="mt-4 w-full bg-gray-600 text-white font-bold py-2 rounded-lg hover:bg-gray-700"
        >
          {isLoginForm ? "Search Berkas" : "Back to Login"}
        </button>
      </div>

      {/* Floating Page for Search Results */}
      {isSearchResultVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-8 w-11/12 max-w-3xl relative shadow-lg">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-700"
              onClick={closeSearchResult}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            {clientData.map((client, index) => (
              <div key={index} className="p-6">
                <h2 className="text-xl font-bold text-black mb-4">
                  Detail Client
                </h2>
                <p className="text-gray-700 mb-4">
                  <strong>{client.nama}</strong>, dengan pemegang NIK{" "}
                  <strong>{client.nik}</strong>, yang beralamat di{" "}
                  <strong>{client.alamat || "N/A"}</strong>, mengajukan layanan{" "}
                  <strong>{client.layanan}</strong>.
                  Dengan detail sebagai berikut : 
                </p>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                  <ul className="list-disc list-inside text-gray-800">
                    <li>Tanggal masuk: {client.tglMasuk ? new Date(client.tglMasuk).toLocaleDateString() : "N/A"}</li>
                    <li>Status: {client.status}</li>
                    <li>Deskripsi : {client.deskripsi || "N/A"}</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
