import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faDownload,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import DataClientForm from "../Form/DataClientForm";
import Swal from "sweetalert2";

const DataClient = () => {
  const [dataClients, setDataClients] = useState([]);
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editDataClient, setEditDataClient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKepemilikan, setFilterKepemilikan] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const clientsPerPage = 5;
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;

  useEffect(() => {
    fetchClients();
    fetchDataClients();
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

  const fetchDataClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dataclients");
      setDataClients(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: "Gagal mengambil data client: " + error.message,
      });
    }
  };

  const handleSaveDataClient = async (newDataClient, file) => {
    const username = localStorage.getItem("username"); 
    const formData = new FormData();
    console.log("Username yang diambil dari localStorage:", username); // Debugging
    formData.append("nama", newDataClient.nama);
    formData.append("kepemilikan", newDataClient.kepemilikan);
    formData.append("createdBy", username);
    formData.append("uploadedBy", username); // Kirim ke backend

    if (file) {
      formData.append("file", file);
    }

    try {
      if (editDataClient) {
        await axios.patch(
          `http://localhost:5000/dataclients/${editDataClient.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data client berhasil diperbarui!",
          timer: 1500,
        });
      } else {
        await axios.post("http://localhost:5000/dataclients", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data client baru berhasil ditambahkan!",
          timer: 1500,
        });
      }
      fetchDataClients();
      setEditDataClient(null);
      toggleForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text:
          "Gagal menyimpan data client: " +
          (error.response?.data?.message || error.message),
      });
    }
  };

  const handleDeleteDataClient = async (id) => {
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
        await axios.delete(`http://localhost:5000/dataclients/${id}`);
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data client telah dihapus.",
          timer: 1500,
        });
        fetchDataClients();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Terjadi kesalahan",
          text: "Gagal menghapus data client: " + error.message,
        });
      }
    }
  };

  const handleEditDataClient = (dataClient) => {
    setEditDataClient(dataClient);
    toggleForm();
  };

  const handleViewFile = (file) => {
    setModalContent(file);
    setShowModal(true);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setErrorMessage("");
  };

  const filteredDataClients = dataClients.filter(
    (dataClient) =>
      (dataClient.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dataClient.kepemilikan
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (filterKepemilikan ? dataClient.kepemilikan === filterKepemilikan : true)
  );

  const currentDataClients = filteredDataClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Documnt Client</h1>

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
            + Add New Data Client
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
                File
              </th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentDataClients.map((dataClient, index) => {
              const createdAt = new Date(dataClient.createdAt);
              const now = new Date();
              const showEditButton =
                (now - createdAt) / (1000 * 60 * 60 * 24) <= 7; // dalam hari

              return (
                <tr key={index} className="text-black">
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    <div className="flex flex-col">
                      <span>{dataClient.nama}</span>
                      <span className="text-xs text-gray-500">
                        Diunggah oleh: {dataClient.createdBy || "Unknown"}
                        <br />
                        Tgl Upload:{" "}
                        {new Date(dataClient.createdAt).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    {dataClient.kepemilikan}
                  </td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    {dataClient.file ? (
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md shadow-md flex items-center justify-center gap-2"
                        onClick={() => handleViewFile(dataClient.file)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    ) : (
                      <span className="text-gray-500">No file</span>
                    )}
                  </td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    <div className="flex justify-around gap-2">
                      {showEditButton && (
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md shadow-md flex items-center gap-2"
                          onClick={() => handleEditDataClient(dataClient)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          
                        </button>
                      )}
                      <a
                        href={dataClient.file}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded-md shadow-md flex items-center gap-2"
                        download={`${dataClient.nama}.pdf`}
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </a>
                      {showEditButton && (
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md shadow-md flex items-center gap-2"
                        onClick={() => handleDeleteDataClient(dataClient.id)}
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
          disabled={currentDataClients.length < clientsPerPage}
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

      {/* Floating data client form */}
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md p-8">
            <DataClientForm
              onCancel={toggleForm}
              onSave={handleSaveDataClient}
              dataClient={editDataClient}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataClient;
