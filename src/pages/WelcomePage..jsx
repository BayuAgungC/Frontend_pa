import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md text-center">
        <h1 className="text-3xl mb-4 font-bold">Selamat Datang</h1>
        <Link to="/login" className="block mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Login</Link>
        <Link to="/search" className="block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Search Berkas</Link>
      </div>
    </div>
  );
};

export default WelcomePage;
