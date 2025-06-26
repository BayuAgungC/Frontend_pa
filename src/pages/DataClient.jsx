import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faDownload, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";
import DataClientForm from "../Form/DataClientForm"; // Import form yang benar

const DataClient = () => {
  const [dataClients, setDataClients] = useState([]);
  const [clients, setClients] = useState([]);
  const [filterKepemilikan, setFilterKepemilikan] = useState("");
  const [filterLayanan, setFilterLayanan] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editDataClient, setEditDataClient] = useState(null); // Data client untuk edit
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [showLayananModal, setShowLayananModal] = useState(false);

  // Untuk form gimmick
  const [selectedLayanan, setSelectedLayanan] = useState("");
  const [selectedKepemilikan, setSelectedKepemilikan] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [syarat, setSyarat] = useState([]);
  const [gimmickData, setGimmickData] = useState({});

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
    formData.append("nama", newDataClient.nama);
    formData.append("kepemilikan", newDataClient.kepemilikan);
    formData.append("kategori", newDataClient.kategori);
    formData.append("layanan", newDataClient.layanan);
    formData.append("status", newDataClient.status);
    formData.append("createdBy", username);
    formData.append("uploadedBy", username);

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

  // Fungsi untuk menghapus Data Client
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
    setEditDataClient(dataClient); // Set data client untuk edit
    setShowForm(true); // Menampilkan form
  };

  // Fungsi untuk melihat file
  const handleViewFile = (file) => {
    setModalContent(file);
    setShowModal(true);
  };

  useEffect(() => {
    fetchClients();
    fetchDataClients();
  }, []);

  // Filter dataClients berdasarkan kepemilikan dan layanan
  const filteredDataClients = dataClients.filter(
    (dataClient) =>
      (filterKepemilikan ? dataClient.kepemilikan === filterKepemilikan : true) &&
      (filterLayanan ? dataClient.layanan === filterLayanan : true)
  );

  // Struktur folder berdasarkan Kepemilikan dan Layanan
  const folderStructure = Array.from(
    new Set(filteredDataClients.map((client) => `${client.kepemilikan}-${client.layanan}-${client.status}`))
  ).map((key) => {
    const [kepemilikan, layanan, status] = key.split("-");
    return {
      kepemilikan,
      layanan,
      status,
      files: filteredDataClients.filter(
        (dataClient) =>
          dataClient.kepemilikan === kepemilikan && dataClient.layanan === layanan && dataClient.status == status
      ),
    };
  });

  // Fungsi untuk membuka atau menutup folder
  const toggleFolder = (kepemilikan, layanan, status) => {
    const folderKey = `${kepemilikan}-${layanan}-${status}`;
    if (selectedFolder === folderKey) {
      setSelectedFolder(null);
    } else {
      setSelectedFolder(folderKey);
    }
  };

  // Fungsi untuk membuka form
  const toggleForm = () => {
    setShowForm(!showForm);
    setErrorMessage("");
  };

  // Fungsi untuk mengedit Data Client

  // Gimmick Form untuk Add Data Client
  const handleGimmickSubmit = () => {
    console.log("Gimmick Form Data: ", gimmickData); // Debugging
    // Melanjutkan ke form asli atau menyimpan data gimmick (jika diperlukan)
    setShowForm(true); // Tampilkan form asli
  };

  // Select layanan dan menampilkan syarat kelengkapan
  const handleLayananChange = (e) => {
    const selected = e.target.value;
    setSelectedLayanan(selected);
    if (selected === "PPJB") {
      setSyarat([
        "Fotokopi KTP ",
        "Fotokopi KK ",
        "Fotokopi Sertifikat",
        "Fotokopi PBB Tahun Terakhir",
        "Fotokopi IMB (jika ada)",
      ]);
    } else if (selected === "AKTA SEWA") {
      setSyarat([
        "Fotokopi KTP Penywa ",
        "Fotokopi KK Penyewa",
        "Fotokopi KTP Pemberi Sewa ",
        "Fotokopi KK Pemberi Sewa",
        "Data Objek Sewa",
      ]);
    } else if (selected === "WASIAT") {
      setSyarat([
        "Fotokopi KTP Ahli waris",
        "Fotokopi KK Ahli waris",
        "Data Harta yang Diwariskan",
        "Penerima Wasiat",
      ]);
    } else {
      setSyarat([]);
    }
  };

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Document Client</h1>

      <div className="mb-4 flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap items-center mb-4">
          <input
            type="text"
            className="w-full md:w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 text-black"
            placeholder="Search..."
            value=""
            onChange={() => { }}
          />
          <button
            className="ml-2 md:ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowLayananModal(true)}
          >
            + Add New Data Client
          </button>
        </div>
      </div>

      {showLayananModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-11/12 md:w-2/3 lg:w-1/2 max-h-[80vh] overflow-auto relative">
      
      <button
        className="absolute top-2 right-2 text-black font-medium bg-transparent hover:underline font-bold"
        onClick={() => setShowLayananModal(false)}
      >
        Close
      </button>

      <h2 className="text-xl font-bold mb-4"> Form</h2>

      {/* Kepemilikan and Status in one row */}
      <div className="flex space-x-4 mb-4">
        <select
          value={selectedKepemilikan}
          onChange={(e) => setSelectedKepemilikan(e.target.value)}
          className="mt-1 block w-1/2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose Kepemilikan</option>
          {clients.map((client) => (
            <option key={client.id} value={client.nama}>
              {client.nama}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="mt-1 block w-1/2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Choose Status</option>
          <option value="proses pemberkasan">Proses Pemberkasan</option>
          <option value="pemberkasan selesai">Pemberkasan Selesai</option>
        </select>
      </div>

      {/* Layanan Select */}
      <select
        value={selectedLayanan}
        onChange={handleLayananChange}
        className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Choose Layanan</option>
        <option value="PPJB">PPJB</option>
        <option value="AKTA SEWA">AKTA SEWA</option>
        <option value="WASIAT">WASIAT</option>
      </select>

      {/* Syarat Kelengkapan with checkboxes */}
      <div className="mt-4">
        {syarat.length > 0 && (
          <div>
            <h3 className="font-semibold">Syarat Kelengkapan</h3>
            {syarat.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    // Optional: you can add logic for checking/unchecking syarat
                  />
                  <span>{item}</span>
                </div>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md shadow-md"
                  onClick={() => setShowForm(true)} // Opens the actual form to upload file
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        onClick={handleGimmickSubmit}
      >
        Submit
      </button>
    </div>
  </div>
)}
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
          value={filterLayanan}
          onChange={(e) => setFilterLayanan(e.target.value)}
        >
          <option value="">Filter by Layanan</option>
          <option value="PPJB">PPJB</option>
          <option value="KK">KM</option>
          <option value="IMB">IMB</option>
          <option value="WASIAT">WASIAT</option>
          <option value="AKTA NIKAH">AKTA SEWA</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="space-y-4">
          {/* Tampilkan folder */}
          {folderStructure.map((folder, index) => (
            <div key={index}>
              <button
                className="w-full text-left bg-gray-200 px-4 py-2 rounded-md shadow-sm"
                onClick={() => toggleFolder(folder.kepemilikan, folder.layanan, folder.status)}
              >
                <span>{folder.kepemilikan} - {folder.layanan} - {folder.status}</span>
              </button>

              {/* Tampilkan file jika folder dibuka */}
              {selectedFolder === `${folder.kepemilikan}-${folder.layanan}-${folder.status}` && (
                <div className="mt-2 pl-6">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                          Nama Dokumen
                        </th>
                        <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                          Action
                        </th>
                        <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                          Info Upload
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {folder.files.map((file, index) => (
                        <tr key={index} className="text-black">
                          <td className="border-t-2 border-gray-200 py-2 px-4">{file.nama}</td>
                          <td className="border-t-2 border-gray-200 py-2 px-4">
                            <div className="flex justify-around gap-2">
                              <button
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-md shadow-md flex items-center justify-center"
                                onClick={() => handleViewFile(file.file)}
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </button>
                              <button
                                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-1 px-3 rounded-md shadow-md flex items-center justify-center"
                                onClick={() => handleEditDataClient(file)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md shadow-md flex items-center justify-center"
                                onClick={() => handleDeleteDataClient(file.id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                          <td className="border-t-2 border-gray-200 py-2 px-4">
                            <span>Uploaded by: {file.createdBy || "Unknown"}</span><br />
                            <span>Tgl Upload: {new Date(file.createdAt).toLocaleDateString("id-ID")}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal untuk melihat file */}
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

      {/* Form untuk menambah/edit data client */}
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white w-full h-full p-8 overflow-auto">
            <DataClientForm
              onCancel={toggleForm}
              onSave={handleSaveDataClient} // Menyimpan data client dengan memanggil fetchDataClients
              dataClient={editDataClient} // Pass data client untuk edit
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataClient;
