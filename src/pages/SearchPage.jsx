import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchPage = () => {
  const [nik, setNik] = useState('');
  const [clientData, setClientData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.get(`http://localhost:5000/clients/nik/${nik}`);
      if (response.data) {
        setClientData([response.data]); // Wrap data in an array for table rendering
      } else {
        setErrorMessage('Data tidak ditemukan');
        setClientData([]);
      }
    } catch (error) {
      setErrorMessage('Terjadi kesalahan saat mencari data');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4 text-black h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Cari Data Berdasarkan NIK</h1>

      <form onSubmit={handleSearch} className="w-full max-w-md mb-4">
        <div className="relative">
          <input
            type="text"
            value={nik}
            onChange={(e) => setNik(e.target.value)}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan NIK"
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 px-4 py-2 bg-blue-500 text-white font-bold rounded-r-lg hover:bg-blue-700 transition duration-300"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </form>

      {errorMessage && (
        <div className="mt-4 text-red-500 font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Table to display client data */}
      {clientData.length > 0 && (
        <div className="w-full max-w-3xl bg-white rounded-md shadow-lg p-4 overflow-hidden transition duration-500 transform scale-100 hover:scale-105">
          <h2 className="text-xl font-semibold mb-4">Detail Client</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 text-left">Nama</th>
                <th className="py-2 px-4 bg-gray-200 text-left">NIK</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Contact</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Layanan</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Tarif</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Terbayar</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Kekurangan</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Keterangan</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Data Tanah</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Luas Tanah (m²)</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Alamat</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Tanggal Masuk</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Tanggal Selesai</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Status</th>
                <th className="py-2 px-4 bg-gray-200 text-left">Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {clientData.map((client, index) => {
                const kekurangan = client.tarif - client.terbayar;
                const keterangan = kekurangan === 0 ? 'Lunas' : 'Belum Lunas';

                return (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border-t-2 border-gray-200 py-2 px-4">{client.nama}</td>
                    <td className="border-t-2 border-gray-200 py-2 px-4">{client.nik}</td>
                    <td className="border-t-2 border-gray-200 py-2 px-4">{client.contact}</td>
                    <td className="border-t-2 border-gray-200 py-2 px-4">{client.layanan}</td>
                    <td className="border-t-2 border-gray-200 py-2 px-4">Rp {client.tarif?.toLocaleString() || '0'}</td>
                    <td className="border-t-2 border-gray-200 py-2 px-4">Rp {client.terbayar?.toLocaleString() || '0'}</td>
                    <td className="border-t-2 border-gray-200 py-2 px-4">Rp {kekurangan?.toLocaleString() || '0'}</td>
                    <td className="border-t-2 border-gray-200 py-2 px-4">{keterangan}</td>
                    <td className="border-t-2 border-gray-200 py-2 px-4">{client.dataTanah || 'N/A'}</td>
                    <td className="border-t-2 border-gray-200 py-2 px-4">{client.luasTanah || 'N/A'}</td>
                    <td className="border-t-2 border-gray-200 py-2 px-4">{client.alamat || 'N/A'}</td>
                    <td className="border-t-2 border-gray-200 py-2 px-4">{new Date(client.tglMasuk).toLocaleDateString()}</td>
                    <td className="border-t-2 border-gray-200 py-2 px-4">{client.tglSelesai ? new Date(client.tglSelesai).toLocaleDateString() : 'N/A'}</td>
                    <td className="border-t-2 border-gray-200 py-2 px-4">{client.status}</td>
                    <td className="border-t-2 border-gray-200 py-2 px-4">{client.deskripsi || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
