import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ClientForm from "../Form/ClientForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const Client = () => {
  const [clients, setClients] = useState([]);
  const [transactions, setTransactions] = useState([]); // Tambahan untuk transaksi
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterLayanan, setFilterLayanan] = useState("");
  const [filterKeteranganLunas, setFilterKeteranganLunas] = useState("");
  const [filterTanggalMasuk, setFilterTanggalMasuk] = useState({
    start: "",
    end: "",
  });
  const [filterTanggalKeluar, setFilterTanggalKeluar] = useState({
    start: "",
    end: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 6;

  useEffect(() => {
    fetchClients();
    fetchTransactions(); // Ambil data transaksi
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/clients");
      setClients(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal mengambil data",
        text: "Terjadi kesalahan saat mengambil data client",
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const calculatePayments = (clientId) => {
    const clientTransactions = transactions.filter(
      (transaction) =>
        transaction.clientId === clientId && transaction.type === "income"
    );
    return clientTransactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
  };

  const updatedClients = clients.map((client) => {
    const totalTerbayar = calculatePayments(client.id);
    const kekurangan = client.tarif - totalTerbayar;
    return {
      ...client,
      terbayar: totalTerbayar,
      kekurangan,
      keterangan: kekurangan === 0 ? "Lunas" : "Belum Lunas",
    };
  });

  const handleSaveClient = async (clientData) => {
    try {
      if (editClient) {
        await axios.patch(
          `http://localhost:5000/clients/${editClient.id}`,
          clientData
        );
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data client berhasil diperbarui",
          timer: 1500,
        });
      } else {
        await axios.post("http://localhost:5000/clients", clientData);
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data client berhasil ditambahkan",
          timer: 1500,
        });
      }
      fetchClients();
      setEditClient(null);
      toggleForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan data client",
      });
    }
  };

  const handleDeleteClient = async (clientId) => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/clients/${clientId}`);
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data client berhasil dihapus",
          timer: 1500,
        });
        fetchClients();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat menghapus data client",
        });
      }
    }
  };

  const handleEditClient = (client) => {
    setEditClient(client);
    toggleForm();
  };

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setShowDetails(true);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredClients = updatedClients.filter((client) => {
    const matchesSearch =
      client.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nik?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.layanan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.dataTanah?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.luasTanah?.toString().includes(searchTerm.toLowerCase()) ||
      client.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.alamat?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus ? client.status === filterStatus : true;
    const matchesLayanan = filterLayanan
      ? client.layanan === filterLayanan
      : true;

    const matchesKeteranganLunas =
      filterKeteranganLunas === ""
        ? true
        : client.keterangan === filterKeteranganLunas;

    const matchesTanggalMasuk =
      filterTanggalMasuk.start && filterTanggalMasuk.end
        ? new Date(client.tglMasuk) >= new Date(filterTanggalMasuk.start) &&
          new Date(client.tglMasuk) <= new Date(filterTanggalMasuk.end)
        : true;

    const matchesTanggalKeluar =
      filterTanggalKeluar.start && filterTanggalKeluar.end
        ? new Date(client.tglSelesai) >= new Date(filterTanggalKeluar.start) &&
          new Date(client.tglSelesai) <= new Date(filterTanggalKeluar.end)
        : true;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesLayanan &&
      matchesKeteranganLunas &&
      matchesTanggalMasuk &&
      matchesTanggalKeluar
    );
  });

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div className="container mx-auto p-4 text-black h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Daftar Client</h1>

      {/* Form pencarian dan tombol tambah */}
      <div className="mb-4 flex flex-wrap items-center justify-between">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full md:w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          placeholder="Cari client..."
        />
        <button
          className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setEditClient(null);
            toggleForm();
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          &nbsp; Tambah
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700">
            Filter Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Semua Status</option>
            <option value="Selesai">Selesai</option>
            <option value="On-Going">On-Going</option>
            <option value="Cancel">Cancel</option>
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700">
            Filter Layanan
          </label>
          <select
            value={filterLayanan}
            onChange={(e) => setFilterLayanan(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Semua Layanan</option>
            {Array.from(new Set(clients.map((client) => client.layanan))).map(
              (layanan) => (
                <option key={layanan} value={layanan}>
                  {layanan}
                </option>
              )
            )}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700">
            Filter Tanggal Masuk
          </label>
          <div className="flex">
            <input
              type="date"
              value={filterTanggalMasuk.start}
              onChange={(e) =>
                setFilterTanggalMasuk({
                  ...filterTanggalMasuk,
                  start: e.target.value,
                })
              }
              className="w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
            />
            <span className="mx-2">s/d</span>
            <input
              type="date"
              value={filterTanggalMasuk.end}
              onChange={(e) =>
                setFilterTanggalMasuk({
                  ...filterTanggalMasuk,
                  end: e.target.value,
                })
              }
              className="w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700">
            Filter Tanggal Keluar
          </label>
          <div className="flex">
            <input
              type="date"
              value={filterTanggalKeluar.start}
              onChange={(e) =>
                setFilterTanggalKeluar({
                  ...filterTanggalKeluar,
                  start: e.target.value,
                })
              }
              className="w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
            />
            <span className="mx-2">s/d</span>
            <input
              type="date"
              value={filterTanggalKeluar.end}
              onChange={(e) =>
                setFilterTanggalKeluar({
                  ...filterTanggalKeluar,
                  end: e.target.value,
                })
              }
              className="w-1/2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Table Client */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <table className="min-w-full bg-white table">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                Nama
              </th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                Tgl Masuk
              </th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                Layanan
              </th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                Data Tanah
              </th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                Luas Tanah (m²)
              </th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                Alamat
              </th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentClients.map((client) => {
              const formattedDateMasuk = new Date(
                client.tglMasuk
              ).toLocaleDateString();
              return (
                <tr key={client.id} className="text-black">
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    {client.nama}
                  </td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    {formattedDateMasuk}
                  </td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    {client.layanan}
                  </td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    {client.dataTanah || "N/A"}
                  </td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    {client.luasTanah || "N/A"} m²
                  </td>
                  <td className="border-t-2 border-gray-200 py-2 px-4">
                    {client.alamat || "N/A"}
                  </td>


                  <td className="border-t-2 border-gray-200 py-2 px-4 flex justify-around">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm"
                      onClick={() => handleEditClient(client)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm ml-2"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-sm ml-2"
                      onClick={() => handleViewDetails(client)}
                    >
                      <FontAwesomeIcon icon={faInfoCircle} />
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
          disabled={currentClients.length < clientsPerPage}
        >
          Next
        </button>
      </div>

      {showDetails && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-3xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Detail Client
              </h2>
            </div>

            {/* Tabel untuk detail client */}
            <table className="min-w-full table-auto text-left">
              <tbody>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">Nama</td>
                  <td className="py-2 px-4 text-gray-900">:</td>
                  <td className="py-2 px-4 text-gray-900">
                    {selectedClient.nama || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">NIK</td>
                  <td className="py-2 px-4 text-gray-900">:</td>
                  <td className="py-2 px-4 text-gray-900">
                    {selectedClient.nik || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">
                    Contact
                  </td>
                  <td className="py-2 px-4 text-gray-900">:</td>
                  <td className="py-2 px-4 text-gray-900">
                    {selectedClient.contact || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">
                    Layanan
                  </td>
                  <td className="py-2 px-4 text-gray-900">:</td>
                  <td className="py-2 px-4 text-gray-900">
                    {selectedClient.layanan || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">
                    Data Tanah
                  </td>
                  <td className="py-2 px-4 text-gray-900">:</td>
                  <td className="py-2 px-4 text-gray-900">
                    {selectedClient.dataTanah || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">
                    Luas Tanah
                  </td>
                  <td className="py-2 px-4 text-gray-900">:</td>
                  <td className="py-2 px-4 text-gray-900">
                    {selectedClient.luasTanah
                      ? `${selectedClient.luasTanah} m²`
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">
                    Alamat
                  </td>
                  <td className="py-2 px-4 text-gray-900">:</td>
                  <td className="py-2 px-4 text-gray-900">
                    {selectedClient.alamat || "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">
                    Tanggal Masuk
                  </td>
                  <td className="py-2 px-4 text-gray-900">:</td>
                  <td className="py-2 px-4 text-gray-900">
                    {new Date(selectedClient.tglMasuk).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">
                    Tanggal Selesai
                  </td>
                  <td className="py-2 px-4 text-gray-900">:</td>
                  <td className="py-2 px-4 text-gray-900">
                    {selectedClient.tglSelesai
                      ? new Date(selectedClient.tglSelesai).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-medium text-gray-700">
                    Deskripsi
                  </td>
                  <td className="py-2 px-4 text-gray-900">:</td>
                  <td className="py-2 px-4 text-gray-900">
                    {selectedClient.deskripsi || "N/A"}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Footer Button */}
            <div className="mt-6 flex justify-end">
              <button
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition duration-200"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md p-8">
            <ClientForm
              onCancel={toggleForm}
              onSave={handleSaveClient}
              client={editClient}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default Client;
