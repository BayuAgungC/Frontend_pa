import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const LaporanForm = ({ onCancel, onSave, laporan }) => {
  const [formData, setFormData] = useState({
    nama: "",
    bulan: "",
    tahun: "",
    jenis: "",
  });
  const [file, setFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const [clients, setClients] = useState([]);
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    fetchClients();
    if (laporan) {
      setFormData({
        nama: laporan.nama,
        bulan: laporan.bulan,
        tahun: laporan.tahun,
        jenis: laporan.jenis,
      });
      setExistingFile(laporan.file);
    }
  }, [laporan]);

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
    setFormData({
      ...formData,
      [name]: value,
    });
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
    if (!formData.nama.trim() || !formData.bulan || !formData.tahun || !formData.jenis) {
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
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Terlalu Besar',
          text: 'Ukuran file tidak boleh melebihi 5MB',
          confirmButtonColor: '#3085d6',
        });
        return;
      }

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
      await onSave(formData, file);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil Disimpan!',
        text: `${laporan ? 'Data diperbarui' : 'Data baru ditambahkan'} dengan berhasil`,
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
          {laporan ? "Edit Laporan" : "Tambah Laporan"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Laporan */}
          <div>
            <label
              htmlFor="nama"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Laporan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Masukkan nama laporan"
            />
          </div>

          {/* Bulan */}
          <div>
            <label
              htmlFor="bulan"
              className="block text-sm font-medium text-gray-700"
            >
              Bulan <span className="text-red-500">*</span>
            </label>
            <select
              id="bulan"
              name="bulan"
              value={formData.bulan}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih Bulan</option>
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
          </div>

          {/* Tahun */}
          <div>
            <label
              htmlFor="tahun"
              className="block text-sm font-medium text-gray-700"
            >
              Tahun <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="tahun"
              name="tahun"
              value={formData.tahun}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Jenis Laporan */}
          <div>
            <label
              htmlFor="jenis"
              className="block text-sm font-medium text-gray-700"
            >
              Jenis Laporan <span className="text-red-500">*</span>
            </label>
            <select
              id="jenis"
              name="jenis"
              value={formData.jenis}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih Jenis</option>
              <option value="Wasiat">Wasiat</option>
              <option value="Daftar Akta">Daftar Akta</option>
              <option value="Pembukuan Surat">Pembukuan Surat</option>
              <option value="Pengesahan Surat">Pengesahan Surat</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          {/* Upload File */}
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              Upload File{" "}
              {!existingFile && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              required={!existingFile}
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
              {laporan ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LaporanForm;
