import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { TiThMenu } from "react-icons/ti";

function Sidebar() {
  // State to manage the sidebar visibility
  const [isOpen, setIsOpen] = useState(true);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Toggle button */}
      <div
        onClick={toggleSidebar} 
        className="fixed top-4 left-4 z-50 text-white rounded p-2 transition w-12 cursor-pointer"
      >
        <TiThMenu/>
      </div>
      
      {/* Sidebar */}
      {isOpen && (
        <div className="fixed left-0 top-0 flex flex-col w-52 h-screen bg-slate-900 text-white shadow-lg pt-12">
          <nav className="flex-1 p-4">
            <ul className="space-y-4">
              <li>
                <Link to="/" className="block px-4 py-2 hover:bg-gray-700 rounded transition"
                onClick={toggleSidebar}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/userdetails" className="block px-4 py-2 hover:bg-gray-700 rounded transition"onClick={toggleSidebar}>
                  Profile
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4">
            <button className="w-full bg-blue-800 hover:bg-blue-500 text-white font-bold py-2 rounded transition">
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
