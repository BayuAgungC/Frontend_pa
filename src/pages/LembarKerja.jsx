import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faDownload,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import LembarKerjaForm from "../Form/LembarKerjaFrom";
import Swal from "sweetalert2";

const LembarKerja = () => {
  const [lembarKerjas, setLembarKerjas] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editLembarKerja, setEditLembarKerja] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKepemilikan, setFilterKepemilikan] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterKategori, setFilterKategori] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const lembarKerjasPerPage = 5;
  const indexOfLastLembarKerja = currentPage * lembarKerjasPerPage;
  const indexOfFirstLembarKerja = indexOfLastLembarKerja - lembarKerjasPerPage;

  useEffect(() => {
    fetchClients();
    fetchLembarKerjas();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/clients");
      setClients(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal mengambil data client",
        text: error.message,
      });
    }
  };

  const fetchLembarKerjas = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/admin/LembarKerja"
      );
      setLembarKerjas(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: "Gagal mengambil data lembar kerja: " + error.message,
      });
    }
  };

  const handleSaveLembarKerja = async (newLembarKerja, file) => {
    const username = localStorage.getItem("username"); 
    const formData = new FormData();
    console.log("Username yang diambil dari localStorage:", username); // Debugging
    formData.append("nama", newLembarKerja.nama);
    formData.append("kepemilikan", newLembarKerja.kepemilikan);
    formData.append("status", newLembarKerja.status);
    formData.append("kategori", newLembarKerja.kategori);
    formData.append("tanggalSelesai", newLembarKerja.tanggalSelesai);
    formData.append("createdBy", username);
    if (file) {
      formData.append("file", file);
    }

    try {
      if (editLembarKerja) {
        await axios.patch(
          `http://localhost:5000/admin/LembarKerja/${editLembarKerja.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data lembar kerja berhasil diperbarui!",
          timer: 1500,
        });
      } else {
        await axios.post("http://localhost:5000/admin/LembarKerja", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data lembar kerja baru berhasil ditambahkan!",
          timer: 1500,
        });
      }
      fetchLembarKerjas();
      setEditLembarKerja(null);
      toggleForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text:
          "Gagal menyimpan data lembar kerja: " +
          (error.response?.data?.message || error.message),
      });
    }
  };

  const handleDeleteLembarKerja = async (id) => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/admin/LembarKerja/${id}`);
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data lembar kerja telah dihapus.",
          timer: 1500,
        });
        fetchLembarKerjas();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Terjadi kesalahan",
          text: "Gagal menghapus data lembar kerja: " + error.message,
        });
      }
    }
  };

  const handleEditLembarKerja = (lembarKerja) => {
    setEditLembarKerja(lembarKerja);
    toggleForm();
  };

  const handleViewFile = (file) => {
    setModalContent(file);
    setShowModal(true);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Get unique values for status and kategori
  const getUniqueValues = (array, key) => {
    return [...new Set(array.map((item) => item[key]))].filter(Boolean);
  };

  const statusOptions = getUniqueValues(lembarKerjas, "status");
  const kategoriOptions = getUniqueValues(lembarKerjas, "kategori");

  const filteredLembarKerjas = lembarKerjas.filter(
    (lembarKerja) =>
      (lembarKerja.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lembarKerja.kepemilikan
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        lembarKerja.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lembarKerja.kategori
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (filterKepemilikan
        ? lembarKerja.kepemilikan === filterKepemilikan
        : true) &&
      (filterStatus ? lembarKerja.status === filterStatus : true) &&
      (filterKategori ? lembarKerja.kategori === filterKategori : true)
  );

  const currentLembarKerjas = filteredLembarKerjas.slice(
    indexOfFirstLembarKerja,
    indexOfLastLembarKerja
  );

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Data Lembar Kerja</h1>

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
            + Add New Lembar Kerja
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-4 flex flex-wrap space-x-2 items-center bg-white p-2 rounded-md shadow-sm">
        <select
          className="px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          value={filterKepemilikan}
          onChange={(e) => setFilterKepemilikan(e.target.value)}
        >
          <option value="">Filter by Kepemilikan</option>
          {clients.map((client) => (
            <option key={client.id} value={client.nama}>
              {client.nama}
            </option>
          ))}
        </select>
        <select
          className="px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Filter by Status</option>
          {statusOptions.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          className="px-3 py-2 bg-white text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value)}
        >
          <option value="">Filter by Kategori</option>
          {kategoriOptions.map((kategori, index) => (
            <option key={index} value={kategori}>
              {kategori}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <table className="min-w-full bg-white table">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                Nama Dokumen
              </th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                Kepemilikan
              </th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                Kategori
              </th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                File
              </th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentLembarKerjas.map((lembarKerja, index) => {
              const createdAt = new Date(lembarKerja.createdAt);
              const now = new Date();
              const showEditButton =
                (now - createdAt) / (1000 * 60 * 60 * 24) <= 7; // dalam hari
              return (
                <tr key={index} className="text-black">
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                  <div className="flex flex-col">
                   <span>{lembarKerja.nama} </span>
                   <span className="text-xs text-gray-500">
                        Diunggah oleh: {lembarKerja.createdBy || "Unknown"}
                        <br />
                        Tgl Upload:{" "}
                        {new Date(lembarKerja.createdAt).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                  </div>
                  </td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    {lembarKerja.kepemilikan}
                  </td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    {lembarKerja.status}
                  </td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    {lembarKerja.kategori}
                  </td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    {lembarKerja.file ? (
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md shadow-md flex items-center justify-center gap-2"
                        onClick={() => handleViewFile(lembarKerja.file)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    ) : (
                      "No file"
                    )}
                  </td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    <div className="flex justify-around gap-2">
                    {showEditButton && (
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md shadow-md flex items-center gap-2"
                        onClick={() => handleEditLembarKerja(lembarKerja)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    )}
                      <a
                        href={lembarKerja.file}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded-md shadow-md flex items-center gap-2"
                        download={`${lembarKerja.nama}.pdf`}
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </a>
                      {showEditButton && (
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md shadow-md flex items-center gap-2"
                        onClick={() => handleDeleteLembarKerja(lembarKerja.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
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
          disabled={currentLembarKerjas.length < lembarKerjasPerPage}
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

      {/* Floating Lembar Kerja form */}
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md p-8">
            <LembarKerjaForm
              onCancel={toggleForm}
              onSave={handleSaveLembarKerja}
              lembarKerja={editLembarKerja}
              clients={clients}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LembarKerja;
