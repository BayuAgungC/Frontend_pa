import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Swal from 'sweetalert2';

const ClientForm = ({ onCancel, onSave, client }) => {
  const initialState = {
    nama: '',
    nik: '',
    contact: '',
    layanan: '',
    dataTanah: '',
    luasTanah: '',
    tglMasuk: '',
    tglSelesai: '',
    status: '',
    deskripsi: '',
    alamat: '',
    tarif: 0,
    terbayar: 0, // Tambahan untuk menampilkan total pembayaran
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (client) {
      setFormData({
        nama: client.nama || '',
        nik: client.nik || '',
        contact: client.contact || '',
        layanan: client.layanan || '',
        dataTanah: client.dataTanah || '',
        luasTanah: client.luasTanah || '',
        tglMasuk: client.tglMasuk ? new Date(client.tglMasuk).toISOString().split('T')[0] : '',
        tglSelesai: client.tglSelesai ? new Date(client.tglSelesai).toISOString().split('T')[0] : '',
        status: client.status || 'Selesai',
        deskripsi: client.deskripsi || '',
        alamat: client.alamat || '',
        tarif: client.tarif || 0,
        terbayar: client.terbayar || 0, // Ambil data terbayar dari prop client
      });
    } else {
      setFormData(initialState);
    }
  }, [client]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleDescriptionChange = useCallback((value) => {
    setFormData((prevData) => ({ ...prevData, deskripsi: value }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (formData.nama && formData.nik && formData.contact && formData.layanan && formData.tglMasuk) {
        onSave(formData);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Data tidak lengkap',
          text: 'Mohon lengkapi semua field yang wajib diisi',
        });
      }
    },
    [formData, onSave]
  );

  const handleCancel = () => {
    Swal.fire({
      title: 'Apakah anda yakin?',
      text: 'Perubahan yang belum disimpan akan hilang!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, keluar!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        onCancel();
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-md shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-black">
          {client ? 'Edit Data Client' : 'Tambah Data Client'}
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {['nama', 'nik', 'contact', 'layanan', 'dataTanah', 'luasTanah', 'tglMasuk', 'tglSelesai', 'alamat'].map(
            (field, index) => (
              <div key={index}>
                <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {field === 'luasTanah' ? (
                  <input
                    type="number"
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-black"
                  />
                ) : field === 'tglMasuk' || field === 'tglSelesai' ? (
                  <input
                    type="date"
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-black"
                    required={field === 'tglMasuk'}
                  />
                ) : (
                  <input
                    type="text"
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-black"
                    required={['nama', 'nik', 'contact', 'layanan'].includes(field)}
                  />
                )}
              </div>
            )
          )}

         

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-black"
            >
              <option value="Selesai">Selesai</option>
              <option value="On-Going">On-Going</option>
              <option value="Cancel">Cancel</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700">
            Deskripsi
          </label>
          <ReactQuill
            id="deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleDescriptionChange}
            className="mt-1 block w-full h-64 border border-gray-300 rounded-md shadow-sm bg-white text-black"
          />
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;
