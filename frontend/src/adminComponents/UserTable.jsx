import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Posts from './Posts';
import Messages from './Message';

const UserTable = () => {
  const [suspiciousUsers, setSuspiciousUsers] = useState([]);
  const [modalUser, setModalUser] = useState({ id: '', isOpen: false });
  const [modalMessageUser, setModalMessageUser] = useState({ id: '', isOpen: false }); // State for Messages modal

  const getSuspiciousUsers = async () => {
    try {
      const response = await axios.get('/api/suspicious');
      setSuspiciousUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getSuspiciousUsers();
  }, []);

  const handleOpenModal = (userId) => {
    setModalUser({ id: userId, isOpen: true });
  };

  const handleCloseModal = () => {
    setModalUser({ id: '', isOpen: false });
  };

  const handleOpenMessageModal = (userId) => {
    setModalMessageUser({ id: userId, isOpen: true });
  };

  const handleCloseMessageModal = () => {
    setModalMessageUser({ id: '', isOpen: false });
  };

  return (
    <div className="container mx-auto px-4">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="text-center px-6 py-4 font-medium text-gray-700">Username</th>
              <th className="text-center px-6 py-4 font-medium text-gray-700">Full Name</th>
              <th className="text-center px-6 py-4 font-medium text-gray-700">Email</th>
              <th className="text-center px-6 py-4 font-medium text-gray-700">Locate</th>
              <th className="text-center px-6 py-4 font-medium text-gray-700">Category</th>
              <th className="text-center px-6 py-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {suspiciousUsers.map((user, index) => {
              const { _id, username, fullname, email, ip, location } = user.userId || {};
              return (
                <tr key={_id}>
                  <td className="px-6 py-4 text-center text-gray-800">{username}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{fullname}</td>
                  <td className="px-6 py-4 text-center text-gray-600">{email}</td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    <a href = {`https://maps.google.com/?q=${location.latitude},${location.longitude}`} target="_blank">
                    {ip}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">{index % 2 === 0 ? "Seller" : "Buyer"}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-1">
                    <button
                      className='bg-emerald-700 p-2 rounded-lg hover:bg-emerald-400'
                      onClick={() => handleOpenModal(_id)}
                    >
                      Posts
                    </button>
                    <button
                      className='bg-emerald-700 p-2 rounded-lg hover:bg-emerald-400'
                      onClick={() => handleOpenMessageModal(_id)}
                    >
                      Messages
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {modalUser.isOpen && (
        <dialog className="modal" open>
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleCloseModal}>
                ✕
              </button>
            </form>
            <Posts id={modalUser.id} />
          </div>
        </dialog>
      )}

      {modalMessageUser.isOpen && (
        <dialog className="modal" open>
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleCloseMessageModal}>
                ✕
              </button>
            </form>
              <Messages id={modalMessageUser.id} />
          </div>
        </dialog>
      )}
    </div>
  );
};

export default UserTable;
