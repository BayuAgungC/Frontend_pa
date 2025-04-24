import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faDownload, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import LaporanForm from "../Form/LaporanForm";

const Laporan = () => {
  const [laporans, setLaporans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editLaporan, setEditLaporan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const laporansPerPage = 5;
  const indexOfLastLaporan = currentPage * laporansPerPage;
  const indexOfFirstLaporan = indexOfLastLaporan - laporansPerPage;

  const filteredLaporans = laporans.filter(laporan =>
    (laporan.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
     laporan.bulan.toLowerCase().includes(searchTerm.toLowerCase()) ||
     laporan.tahun.includes(searchTerm) ||
     laporan.jenis.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterJenis ? laporan.jenis === filterJenis : true) &&
    (filterBulan ? laporan.bulan === filterBulan : true) &&
    (filterTahun ? laporan.tahun === filterTahun : true)
  );

  const currentLaporans = filteredLaporans.slice(indexOfFirstLaporan, indexOfLastLaporan);

  useEffect(() => {
    fetchLaporans();
  }, []);

  const fetchLaporans = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/laporans');
      setLaporans(response.data);
    } catch (error) {
      setErrorMessage('Failed to fetch laporans: ' + error.message);
    }
  };
  
  

  const toggleForm = () => {
    setShowForm(!showForm);
    setErrorMessage('');
  };

  const handleSaveLaporan = async (newLaporanData, file) => {
    const formData = new FormData();
    formData.append("nama", newLaporanData.nama);
    formData.append("bulan", newLaporanData.bulan);
    formData.append("tahun", newLaporanData.tahun);
    formData.append("jenis", newLaporanData.jenis);
    if (file) {
      formData.append("file", file);
    }
  
    try {
      if (editLaporan) {
        // PATCH request to update laporan
        await axios.patch(`http://localhost:5000/admin/laporans/${editLaporan.id}`, formData);
      } else {
        // POST request to create new laporan
        await axios.post('http://localhost:5000/admin/laporans', formData);
      }
      fetchLaporans();
      setEditLaporan(null);
      toggleForm();
    } catch (error) {
      if (error.response) {
        setErrorMessage('Failed to save laporan: ' + error.response.data.message);
      } else {
        setErrorMessage('Failed to save laporan: ' + error.message);
      }
    }
  };
  

  const handleDeleteLaporan = async (laporanId) => {
    try {
      await axios.delete(`http://localhost:5000/admin/laporans/${laporanId}`);
      fetchLaporans();
    } catch (error) {
      setErrorMessage('Failed to delete laporan: ' + error.message);
    }
  };
  

  const handleViewFile = (file) => {
    setModalContent(file); // This is now base64 content from the backend
    setShowModal(true);
  };

  const handleEditLaporan = (laporan) => {
    setEditLaporan(laporan);
    toggleForm();
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const uniqueYears = [...new Set(laporans.map(laporan => laporan.tahun))];

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Laporan</h1>

      <div className="mb-4 flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center mb-4">
          <input
            type="text"
            className="w-full md:w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 text-black"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="ml-2 md:ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={toggleForm}
          >
            + Add New Laporan
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap space-x-2 items-center bg-white p-2 rounded-md shadow-sm">
        <select
          className="px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          value={filterJenis}
          onChange={(e) => setFilterJenis(e.target.value)}
        >
          <option value="">Filter by Jenis</option>
          <option value="Wasiat">Wasiat</option>
          <option value="Daftar Akta">Daftar Akta</option>
          <option value="Pembukuan Surat">Pembukuan Surat</option>
          <option value="Pengesahan Surat">Pengesahan Surat</option>
          <option value="Lainnya">Lainnya</option>
        </select>
        <select
          className="px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          value={filterBulan}
          onChange={(e) => setFilterBulan(e.target.value)}
        >
          <option value="">Filter by Bulan</option>
          <option value="Januari">Januari</option>
          <option value="Februari">Februari</option>
          <option value="Maret">Maret</option>
          <option value="April">April</option>
          <option value="Mei">Mei</option>
          <option value="Juni">Juni</option>
          <option value="Juli">Juli</option>
          <option value="Agustus">Agustus</option>
          <option value="September">September</option>
          <option value="Oktober">Oktober</option>
          <option value="November">November</option>
          <option value="Desember">Desember</option>
        </select>
        <select
          className="px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          value={filterTahun}
          onChange={(e) => setFilterTahun(e.target.value)}
        >
          <option value="">Filter by Tahun</option>
          {uniqueYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <div className="bg-white rounded-lg shadow-lg p-4">
        <table className="min-w-full bg-white table">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Nama Laporan</th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Bulan</th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Tahun</th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Jenis</th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentLaporans.map((laporan, index) => (
              <tr key={index} className="text-black">
                <td className="border-t-2 border-gray-200 py-2 px-4">{laporan.nama}</td>
                <td className="border-t-2 border-gray-200 py-2 px-4">{laporan.bulan}</td>
                <td className="border-t-2 border-gray-200 py-2 px-4">{laporan.tahun}</td>
                <td className="border-t-2 border-gray-200 py-2 px-4">{laporan.jenis}</td>
                <td className="border-t-2 border-gray-200 py-2 px-4">
                  <div className="flex justify-around gap-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleEditLaporan(laporan)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleViewFile(laporan.file)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <a
                      href={laporan.file} // URL base64
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded"
                      download
                    >
                      <FontAwesomeIcon icon={faDownload} /> 
                    </a>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => handleDeleteLaporan(laporan.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> 
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
          disabled={currentLaporans.length < laporansPerPage}
        >
          Next
        </button>
      </div>

      {/* Modal for viewing files */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-11/12 md:w-3/4 lg:w-1/2 h-3/4 relative">
            <button
              className="absolute top-2 right-2 text-red-500"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            <iframe
              src={modalContent}
              className="w-full h-full"
              frameBorder="0"
              title="File Viewer"
            ></iframe>
          </div>
        </div>
      )}

      {/* Floating laporan form */}
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md p-8">
            <LaporanForm onCancel={toggleForm} onSave={handleSaveLaporan} laporan={editLaporan} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Laporan;
