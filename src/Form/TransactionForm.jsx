import React, { useState, useEffect } from "react";
import axios from "axios";

const TransactionForm = ({ onCancel, onSave, transaction, formType }) => {
  const [date, setDate] = useState(transaction?.date || "");
  const [description, setDescription] = useState(transaction?.description || "");
  const [amount, setAmount] = useState(transaction?.amount || "");
  const [clientId, setClientId] = useState(transaction?.clientId || ""); // Tambahan client ID
  const [clients, setClients] = useState([]); // Daftar klien

  useEffect(() => {
    if (transaction) {
      setDate(transaction.date.split("T")[0]);
      setDescription(transaction.description);
      setAmount(formatRupiah(transaction.amount.toString()));
      setClientId(transaction.clientId || ""); // Set client ID saat edit
    }
    fetchClients();
  }, [transaction]);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  // Fungsi untuk memformat input ke format Rupiah
  const formatRupiah = (value) => {
    const numberString = value.replace(/[^,\d]/g, "").toString();
    const split = numberString.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return rupiah;
  };

  const handleAmountChange = (e) => {
    const formattedValue = formatRupiah(e.target.value);
    setAmount(formattedValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(/\./g, ""));
    if (!description || !numericAmount || !date) {
      alert("All fields are required");
      return;
    }
    onSave({ date, description, type: formType, amount: numericAmount, clientId });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">{transaction ? "Edit Transaction" : "Add Transaction"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
            placeholder="Transaction description"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rp)</label>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
            placeholder="Amount in Rp"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client (Optional)</label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.nama}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white py-2 px-4 rounded-md">
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
