import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaFileAlt,
  FaRegFile,
  FaClipboardList,
  FaBook,
  FaMoneyBillAlt,
  FaBars,
  FaUserCog,
  FaSignOutAlt,
} from "react-icons/fa"; // React Icons

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  
  // Mendapatkan role pengguna dari localStorage
  const role = localStorage.getItem("role");

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/"); // Redirect ke WelcomePage setelah logout
  };

  return (
    <div
      className={`fixed z-30 inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0 w-64" : "translate-x-0 w-16"
      } transition-all duration-300 bg-blue-900 text-white shadow-md h-full`}
    >
      <div className="flex flex-col h-full">
        {/* Bagian toggle */}
        <div className="flex items-center p-1">
          <button
            onClick={toggleSidebar}
            className="text-white text-lg flex items-center justify-center w-8 h-8 rounded-full bg-blue-900 hover:bg-blue-700"
          >
            {isOpen ? (
              <span className="text-white text-lg font-bold">SI</span>
            ) : (
              <span className="text-white text-lg font-bold">SI</span>
            )}
          </button>
          {/* Teks hanya tampil jika sidebar terbuka */}
          {isOpen && (
            <span className="text-white text-lg font-bold ml-2">
              Kantor Notaris
            </span>
          )}
        </div>

        {/* Daftar menu */}
        <ul className="flex-1">
          <li className="mb-4">
            <Link
              to="/"
              className="flex items-center py-2 px-4 rounded hover:bg-blue-700"
            >
              <FaHome className="mr-3 text-white" />
              <span className={`${!isOpen && "hidden"} text-white`}>
                Dashboard
              </span>
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/Client"
              className="flex items-center py-2 px-4 rounded hover:bg-blue-700"
            >
              <FaUser className="mr-3 text-white" />
              <span className={`${!isOpen && "hidden"} text-white`}>
                Client
              </span>
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/DataClient"
              className="flex items-center py-2 px-4 rounded hover:bg-blue-700"
            >
              <FaFileAlt className="mr-3 text-white" />
              <span className={`${!isOpen && "hidden"} text-white`}>
                Document Client
              </span>
            </Link>
          </li>

          {/* Menu ini hanya muncul jika role adalah admin */}
          {role === "admin" && (
            <>
              <li className="mb-4">
                <Link
                  to="/LembarKerja"
                  className="flex items-center py-2 px-4 rounded hover:bg-blue-700"
                >
                  <FaRegFile className="mr-3 text-white" />
                  <span className={`${!isOpen && "hidden"} text-white`}>
                    Lembar Kerja
                  </span>
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/Laporan"
                  className="flex items-center py-2 px-4 rounded hover:bg-blue-700"
                >
                  <FaClipboardList className="mr-3 text-white" />
                  <span className={`${!isOpen && "hidden"} text-white`}>
                    Laporan
                  </span>
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/UserManager"
                  className="flex items-center py-2 px-4 rounded hover:bg-blue-700"
                >
                  <FaMoneyBillAlt className="mr-3 text-white" />
                  <span className={`${!isOpen && "hidden"} text-white`}>
                    User Manager
                  </span>
                </Link>
              </li>
            </>
          )}

          <li className="mb-4">
            <Link
              to="/BukuTamu"
              className="flex items-center py-2 px-4 rounded hover:bg-blue-700"
            >
              <FaBook className="mr-3 text-white" />
              <span className={`${!isOpen && "hidden"} text-white`}>
                Buku Tamu
              </span>
            </Link>
          </li>

        </ul>
        {/* Logout Button */}
        <div className="mb-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full py-2 px-4 rounded bg-blue-900 text-white hover:bg-red-600 focus:outline-none"
          >
            <FaSignOutAlt className="mr-3 text-white" />
            <span className={`${!isOpen && "hidden"} text-white`}>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
