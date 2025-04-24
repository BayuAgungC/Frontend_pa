import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import TransactionForm from "../Form/TransactionForm";
import axios from "axios";

const MoneyManage = () => {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formType, setFormType] = useState("income");
  const [filterType, setFilterType] = useState("");
  const [filterClient, setFilterClient] = useState(""); // Tambahkan filter client
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]); // Daftar klien

  const transactionsPerPage = 4;

  useEffect(() => {
    fetchTransactions();
    fetchClients(); // Ambil daftar klien saat komponen dimuat
  }, [filterType, filterClient, startDate, endDate, searchTerm]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/transactions?type=${filterType}&clientId=${filterClient}&startDate=${startDate}&endDate=${endDate}&search=${searchTerm}`
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:5000/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleSaveTransaction = async (transactionData) => {
    try {
      if (editTransaction) {
        await axios.patch(
          `http://localhost:5000/transactions/${editTransaction.id}`,
          transactionData,
          {
            headers: {
              "Content-Type": "application/json"
            },
          }
        );
      } else {
        await axios.post("http://localhost:5000/transactions", transactionData, {
          headers: {
            "Content-Type": "application/json"
          },
        });
      }
      setEditTransaction(null);
      toggleForm();
      fetchTransactions();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditTransaction(transaction);
    setFormType(transaction.type);
    toggleForm();
  };

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await axios.delete(`http://localhost:5000/transactions/${transactionId}`);
      fetchTransactions();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const totalIncome = transactions.reduce(
    (acc, transaction) => (transaction.type === "income" ? acc + transaction.amount : acc),
    0
  );
  const totalExpense = transactions.reduce(
    (acc, transaction) => (transaction.type === "expense" ? acc + transaction.amount : acc),
    0
  );
  const remainingMoney = totalIncome - totalExpense;

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div className="container mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Manajemen Uang Masuk & Keluar</h1>

      {/* Dashboard Summary */}
      <div className="bg-white rounded-md p-4 shadow-md mb-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-200 rounded-md p-4 shadow-md">
            <h3 className="text-sm font-bold mb-2">Total Income</h3>
            <p className="text-xl font-bold">Rp {totalIncome.toLocaleString()}</p>
          </div>
          <div className="bg-red-200 rounded-md p-4 shadow-md">
            <h3 className="text-sm font-bold mb-2">Total Expense</h3>
            <p className="text-xl font-bold">Rp {totalExpense.toLocaleString()}</p>
          </div>
          <div className="bg-blue-200 rounded-md p-4 shadow-md">
            <h3 className="text-sm font-bold mb-2">Uang Tersisa</h3>
            <p className="text-xl font-bold">Rp {remainingMoney.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filter Bar (Search, Type Filter, Date Range Filter, Client Filter) */}
      <div className="mb-4 flex space-x-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 px-4 py-2 border border-gray-300 rounded-md bg-white"
          placeholder="Search transactions"
        />
        <select
          className="w-1/3 px-4 py-2 border border-gray-300 rounded-md bg-white"
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <div className="w-1/3">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
          >
            <option value="">All Clients</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.nama}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/3 flex space-x-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white"
          />
        </div>
      </div>

      {/* Add Transaction Buttons */}
      <div className="mb-4 flex justify-between items-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setEditTransaction(null);
            setFormType("income");
            toggleForm();
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          &nbsp; Tambah Uang Masuk
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setEditTransaction(null);
            setFormType("expense");
            toggleForm();
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          &nbsp; Tambah Uang Keluar
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Client</th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Type</th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Amount (Rp)</th>
              <th className="py-2 px-4 bg-gray-200 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr key={transaction.id} className="text-black">
                <td className="border-t-2 border-gray-200 py-2 px-4">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="border-t-2 border-gray-200 py-2 px-4">{transaction.description}</td>
                <td className="border-t-2 border-gray-200 py-2 px-4">
                  {transaction.clientId
                    ? clients.find((client) => client.id === transaction.clientId)?.nama || "N/A"
                    : "N/A"}
                </td>
                <td className="border-t-2 border-gray-200 py-2 px-4">
                  {transaction.type === "income" ? "Income" : "Expense"}
                </td>
                <td className="border-t-2 border-gray-200 py-2 px-4">{transaction.amount.toLocaleString()}</td>
                <td className="border-t-2 border-gray-200 py-2 px-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleEditTransaction(transaction)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
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
          disabled={currentTransactions.length < transactionsPerPage}
        >
          Next
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md p-8">
            <TransactionForm
              onCancel={toggleForm}
              onSave={handleSaveTransaction}
              transaction={editTransaction}
              formType={formType}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MoneyManage;
