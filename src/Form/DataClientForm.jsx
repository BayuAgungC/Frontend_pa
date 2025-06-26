import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const DataClientForm = ({ onCancel, onSave, dataClient }) => {
  const [newDataClient, setNewDataClient] = useState({
    nama: "",
    kepemilikan: "",
    kategori:"",
    layanan:"",
    status:"",
    file: "",
  });
  const [clients, setClients] = useState([]);
  const [file, setFile] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    fetchClients();
    if (dataClient) {
      setNewDataClient({
        nama: dataClient.nama,
        kepemilikan: dataClient.kepemilikan,
        kategori: dataClient.kategori,
        layanan: dataClient.layanan,
        status: dataClient.status,
        file: dataClient.file,
      });
    } else {
      setNewDataClient({
        nama: "",
        kepemilikan: "",
        kategori:"",
        layanan:"",
        status:"",
        file: "",
      });
    }
  }, [dataClient]);

  const fetchClients = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/clients");
      setClients(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: "Gagal mengambil data client: " + error.message,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDataClient({ ...newDataClient, [name]: value });
    setIsFormDirty(true);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setIsFormDirty(true);
  };

  const handleCancel = async () => {
    if (isFormDirty) {
      const result = await Swal.fire({
        title: "Apakah anda yakin?",
        text: "Perubahan yang belum disimpan akan hilang. Apakah Anda ingin membuangnya?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, buang perubahan",
        cancelButtonText: "Tidak, tetap edit",
      });

      if (result.isConfirmed) {
        Swal.fire({
          icon: "info",
          title: "Perubahan Dibuang",
          text: "Perubahan Anda telah dibuang",
          timer: 1500,
          showConfirmButton: false,
        });
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!newDataClient.nama.trim() || !newDataClient.kepemilikan) {
      Swal.fire({
        icon: 'warning',
        title: 'Field Wajib Diisi',
        text: 'Harap isi semua field yang wajib diisi',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    // File validation
    if (file) {
      // Validasi ukuran file (maksimum 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Terlalu Besar',
          text: 'Ukuran file tidak boleh melebihi 5MB',
          confirmButtonColor: '#3085d6',
        });
        return;
      }

      // Check file type (you can customize the allowed types)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Tipe File Tidak Valid',
          text: 'Harap unggah dokumen yang valid (PDF, JPEG, PNG, DOC, atau DOCX)',
          confirmButtonColor: '#3085d6',
        });
        return;
      }
    }
    // Show loading state
    Swal.fire({
      title: 'Menyimpan...',
      text: 'Mohon tunggu sementara kami menyimpan data Anda',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await onSave(newDataClient, file);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil Disimpan!',
        text: `${dataClient ? 'Data diperbarui' : 'Data baru ditambahkan'} dengan berhasil`,
        timer: 1500,
        showConfirmButton: false
      });
      setIsFormDirty(false);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Terjadi kesalahan',
        text: 'Gagal menyimpan data: ' + error.message,
        confirmButtonColor: '#3085d6',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">
          {dataClient ? "Edit Data Client" : "Tambah Data Client"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Dokumen */}
          <div>
            <label
              htmlFor="nama"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Dokumen <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={newDataClient.nama}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Masukkan nama dokumen"
            />
          </div>

          {/* Kepemilikan */}
          <div>
            <label
              htmlFor="kepemilikan"
              className="block text-sm font-medium text-gray-700"
            >
              Kepemilikan <span className="text-red-500">*</span>
            </label>
            <select
              id="kepemilikan"
              name="kepemilikan"
              value={newDataClient.kepemilikan}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.nama}>
                  {client.nama}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="kategori"
              className="block text-sm font-medium text-gray-700"
            >
              kategori<span className="text-red-500">*</span>
            </label>
            <select
              id="kategori"
              name="kategori"
              value={newDataClient.kategori}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="KTP">KTP</option>
              <option value="KK">KK</option>
              <option value="NPWP">NPWP</option>
              <option value="SERTIFIKAT">SERTIFIKAT</option>
              <option value="SURAT NIKAH">SURAT NIKAH</option>
              <option value="AKTA KEMATIAN">AKTA KEMATIAN</option>
              <option value="LAINYA">LAINYA</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="layanan"
              className="block text-sm font-medium text-gray-700"
            >
              layanan<span className="text-red-500">*</span>
            </label>
            <select
              id="layanan"
              name="layanan"
              value={newDataClient.layanan}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="PPJB">PPJB</option>
              <option value="KK">KM</option>
              <option value="IMB">IMB</option>
              <option value="WASIAT">WASIAT</option>
              <option value="AKTA NIKAH">AKTA SEWA</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              status<span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={newDataClient.status}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="proses pemberkasan">proses pemberkasan</option>
              <option value="pemberkasan selesai">pemberkasan selesai</option>
            </select>
          </div>
          {/* Upload File */}
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              Upload File{" "}
              {!dataClient?.file && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              required={!dataClient?.file}
            />
            <p className="mt-1 text-sm text-gray-500">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {dataClient ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataClientForm;