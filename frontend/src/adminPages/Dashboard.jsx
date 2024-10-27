// Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Cards from './../adminComponents/Card';
import LineChart from './../adminComponents/LineChart';
import axios from 'axios';
import MapComponent from '../adminComponents/MapComponent';

const Dashboard = () => {
  const [suspiciousUsers, setSuspiciousUsers] = useState([]);
  const getSuspiciousUsers = async () => {
    try {
      const response = await axios.get('/api/suspicious');
      setSuspiciousUsers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const noOfSuspiciousUsers = suspiciousUsers.length;
  const noOfFlaggedPosts = suspiciousUsers.reduce((acc, user) => acc + user.posts.length, 0);
  const noOfFlaggedMessages = suspiciousUsers.reduce((acc, user) => acc + user.messages.length, 0);

  useEffect(() => {
    getSuspiciousUsers();
  }, []);
  
  return (
    <div className="flex flex-wrap justify-center mr-auto border-gray-700 min-h-screen bg-gray-800 p-4 md:p-6 lg:p-8">
      <div className="grid md:flex md:gap-6 mb-8">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 p-5">
          <Link to='/admin/userdetails' className='m-2 cursor-pointer'>
            <Cards title="Suspicious Users" value={noOfSuspiciousUsers} change="🕵" />
          </Link>
          <div className='m-2'>
            <Cards title="Total Flagged Posts" value={noOfFlaggedPosts} change="🚩" />
          </div>
          <div className='m-2'>
            <Cards title="Total Flagged Messages" value={noOfFlaggedMessages} change="✉️" />
          </div>
          <div className='m-2'>
            <Cards title="Action Taken" value="0" change="✅" />
          </div>
        </div>
        <div className="m-2 flex-1 mt-6 w-full md:w-1/3 lg:w-1/4">
          <LineChart />
        </div>
      </div>
      <MapComponent/>
    </div>
  );
};

export default Dashboard;
