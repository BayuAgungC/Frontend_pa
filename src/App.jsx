import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Client from './pages/Client';
import DataClient from './pages/DataClient';
import LembarKerja from './pages/LembarKerja';
import Laporan from './pages/Laporan';
import BukuTamu from './pages/BukuTamu';
import MoneyManage from './pages/MoneyManage';
import LoginPage from './pages/LoginPage';
import UserManager from './pages/UserManager';
import './App.css'; // Mengimpor file CSS

// Layout untuk halaman dengan sidebar
const LayoutWithSidebar = ({ children, isSidebarOpen, toggleSidebar, role }) => (
  <div className="App">
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role={role} />
    <div className={`content ${isSidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
      {children}
    </div>
  </div>
);

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [role, setRole] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    if (!token) {
      navigate('/LoginPage');
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/LoginPage" element={<LoginPage setRole={setRole} />} />
      {/* Route dengan sidebar */}
      <Route
        path="*"
        element={
          <LayoutWithSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} role={role}>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="Client" element={<Client />} />
              <Route path="DataClient" element={<DataClient />} />
              <Route path="LembarKerja" element={<LembarKerja />} />
              <Route path="Laporan" element={<Laporan />} />
              <Route path="BukuTamu" element={<BukuTamu />} />
              <Route path="MoneyManage" element={<MoneyManage />} />
              {role === 'admin' && <Route path="UserManager" element={<UserManager />} />}
            </Routes>
          </LayoutWithSidebar>
        }
      />
    </Routes>
  );
}

export default App;
