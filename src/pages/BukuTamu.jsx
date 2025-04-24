import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TamuForm from '../Form/TamuForm'; // Import <TamuForm> component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const BukuTamu = () => {
  const [Tamuss, setTamuss] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTamus, setEditTamus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const [startDate, setStartDate] = useState(''); // Start date filter
  const [endDate, setEndDate] = useState(''); // End date filter
  const TamussPerPage = 6; // Number of Tamus per page


  useEffect(() => {
    fetchTamuss();
  }, [searchTerm, startDate, endDate]);

  const fetchTamuss = async () => {
    try {
      const response = await axios.get('http://localhost:5000/Tamus', {
        params: { search: searchTerm, startDate, endDate },
      });
      setTamuss(response.data);
    } catch (error) {
      console.error('Failed to fetch Tamuss', error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSaveTamus = async (TamusData) => {
    try {
      if (editTamus) {
        await axios.patch(`http://localhost:5000/Tamus/${editTamus.id}`, TamusData);
      } else {
        await axios.post('http://localhost:5000/Tamus', TamusData);
      }
      fetchTamuss();
      setEditTamus(null);
    } catch (error) {
      console.error('Failed to save Tamus', error);
    }
    toggleForm();
  };


  const handleEditTamus = (Tamus) => {
    setEditTamus(Tamus);
    toggleForm();
  };

  const handleDeleteTamus = async (TamusId) => {
    try {
      await axios.delete(`http://localhost:5000/Tamus/${TamusId}`);
      fetchTamuss();
    } catch (error) {
      console.error('Failed to delete Tamus', error);
    }
  };

  const indexOfLastTamus = currentPage * TamussPerPage;
  const indexOfFirstTamus = indexOfLastTamus - TamussPerPage;
  const currentTamuss = Tamuss.slice(indexOfFirstTamus, indexOfLastTamus);

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Buku Tamu</h1>

      {/* Search Bar and Filter by Date */}
      <div className="mb-4 flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center mb-4 space-x-4">
          <input
            type="text"
            className="w-full md:w-64 px-3 py-2 bg-white hover:bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 text-black"
            placeholder="Search Nama, Alamat, No Telepon, Keperluan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input
            type="date"
            className="w-full md:w-64 px-3 py-2 bg-white hover:bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 text-black"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="w-full md:w-64 px-3 py-2 bg-white hover:bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 text-black"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            className="ml-2 md:ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={toggleForm}
          >
            Tambah Tamu
          </button>
        </div>
      </div>

      {/* Tamus Table */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <table className="min-w-full bg-white table">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Nama</th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Alamat</th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">No Telepon</th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Keperluan</th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Tgl Berkunjung</th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Jam Berkunjung</th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentTamuss.map((Tamus, index) => {
              // Format tanggal dan jam
              const formattedDate = new Date(Tamus.tglKunjungan).toLocaleDateString();
              const formattedTime = new Date(`1970-01-01T${Tamus.jamKunjungan}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <tr key={Tamus.id} className="text-black">
                  <td className="border-t-2 border-gray-200 py-2 px-4">{Tamus.nama}</td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">{Tamus.alamat}</td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">{Tamus.noTelp}</td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">{Tamus.keperluan}</td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">{formattedDate}</td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">{formattedTime}</td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleEditTamus(Tamus)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                      onClick={() => handleDeleteTamus(Tamus.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={nextPage}
          disabled={currentTamuss.length < TamussPerPage}
        >
          Next
        </button>
      </div>

      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md p-8">
            <TamuForm onCancel={toggleForm} onSave={handleSaveTamus} Tamus={editTamus} />
          </div>
        </div>
      )}
      <footer className="mt-auto">
        <p className="text-center text-sm text-gray-600 mt-8">&copy; 2024 Sistem Informasi Manajemen Kantor Notaris. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BukuTamu;
