import React, { useState, useEffect } from 'react';

const TamuForm = ({ onCancel, onSave, Tamus }) => {
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    noTelp: '',
    keperluan: '',
    tglKunjungan: '',
    jamKunjungan: ''
  });

  useEffect(() => {
    if (Tamus) {
      setFormData({
        nama: Tamus.nama || '',
        alamat: Tamus.alamat || '',
        noTelp: Tamus.noTelp || '',
        keperluan: Tamus.keperluan || '',
        tglKunjungan: Tamus.tglKunjungan || '',
        jamKunjungan: Tamus.jamKunjungan || ''
      });
    }
  }, [Tamus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-md shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-black">{Tamus ? 'Edit Data Tamu' : 'Tambah Data Tamu'}</h2>
        
        {['nama', 'alamat', 'noTelp', 'keperluan', 'tglKunjungan', 'jamKunjungan'].map((field, index) => (
          <div key={index} className="mb-6">
            <label className="block text-sm font-medium text-gray-700" htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type={field === 'tglKunjungan' ? 'date' : field === 'jamKunjungan' ? 'time' : 'text'}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        ))}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Batal
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Simpan
          </button>
        </div>
      </form>
      <style jsx>{`
        /* Custom styling for date and time inputs */
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0) grayscale(0) brightness(0) contrast(1);
        }

        input[type="time"]::-webkit-inner-spin-button,
        input[type="time"]::-webkit-clear-button {
          filter: invert(0) grayscale(0) brightness(0) contrast(1);
        }
      `}</style>
    </div>
  );
};

export default TamuForm;
