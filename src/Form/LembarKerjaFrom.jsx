import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const LembarKerjaForm = ({ onCancel, onSave, lembarKerja, clients }) => {
  const [formData, setFormData] = useState({
    nama: "",
    kepemilikan: "",
    status: "",
    kategori: "",
    tanggalSelesai: "",
  });
  const [file, setFile] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    if (lembarKerja) {
      setFormData({
        nama: lembarKerja.nama,
        kepemilikan: lembarKerja.kepemilikan,
        status: lembarKerja.status,
        kategori: lembarKerja.kategori,
        tanggalSelesai: lembarKerja.tanggalSelesai,
      });
    }
  }, [lembarKerja]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    if (!formData.nama.trim() || !formData.kepemilikan) {
      Swal.fire({
        icon: "warning",
        title: "Field Wajib Diisi",
        text: "Harap isi semua field yang wajib diisi",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // File validation
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB size limit
        Swal.fire({
          icon: "error",
          title: "File Terlalu Besar",
          text: "Ukuran file tidak boleh melebihi 5MB",
          confirmButtonColor: "#3085d6",
        });
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: "error",
          title: "Tipe File Tidak Valid",
          text: "Harap unggah dokumen yang valid (PDF, JPEG, PNG, DOC, atau DOCX)",
          confirmButtonColor: "#3085d6",
        });
        return;
      }
    }

    // Show loading state
    Swal.fire({
      title: "Menyimpan...",
      text: "Mohon tunggu sementara kami menyimpan data Anda",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      await onSave(formData, file);
      Swal.fire({
        icon: "success",
        title: "Berhasil Disimpan!",
        text: `${
          lembarKerja ? "Data diperbarui" : "Data baru ditambahkan"
        } dengan berhasil`,
        timer: 1500,
        showConfirmButton: false,
      });
      setIsFormDirty(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: "Gagal menyimpan data: " + error.message,
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">
          {lembarKerja ? "Edit Lembar Kerja" : "Tambah Lembar Kerja"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Dokumen */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nama Dokumen <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Masukkan nama dokumen"
            />
          </div>

          {/* Kepemilikan */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kepemilikan <span className="text-red-500">*</span>
            </label>
            <select
              name="kepemilikan"
              value={formData.kepemilikan}
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
            <label className="block text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih status</option>
              {["draft", "cancel", "selesai", "pending", "penandatanganan"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kategori
            </label>
            <input
              type="text"
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan kategori"
            />
          </div>

          {/* Tanggal Selesai */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Selesai
            </label>
            <input
              type="date"
              name="tanggalSelesai"
              value={formData.tanggalSelesai}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Upload File */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            {lembarKerja?.file && (
              <p className="mt-2 text-sm text-gray-500">
                Current File: {lembarKerja.file}
              </p>
            )}
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
              {lembarKerja ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LembarKerjaForm;
