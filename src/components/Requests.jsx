import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { Heart, X, Inbox } from 'lucide-react';
import { addRequest, removeRequest } from "../utils/requestSlice";
import { Link } from "react-router-dom";

const Request = () => {
  const requests = useSelector((store) => store.request);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
     
      await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
   
      fetchRequest(); 
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequest = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/received", {
        withCredentials: true,
      });
      dispatch(addRequest(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  if (!requests) return null; // Or a loading spinner

  // --- "No Requests" Card (White & Blue Theme) ---
  if (requests.length === 0) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 p-4">
            <div className="text-center bg-white p-10 rounded-2xl shadow-xl border border-gray-200 max-w-md w-full">
                <Inbox size={60} className="mx-auto text-blue-500 mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">No New Requests</h1>
                <p className="text-gray-500 mb-6">
                    You're all caught up! When someone wants to connect, their request will appear here.
                </p>
                <Link to="/feed">
                    <button className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300'>
                        Back to Homepage
                    </button>
                </Link>
            </div>
        </div>
    );
  }

  // --- Requests Grid (White & Blue Theme) ---
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900">Requests Received</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {requests.map((request) => {
          // Destructure from the nested fromUserId object
          const { _id, firstName, lastName, photoUrl, about } = request.fromUserId;
          return (
            <div
              key={request._id} // Use the unique ID of the request itself as the key
              className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden flex flex-col text-center border border-gray-200"
            >
              <div className="p-5 flex flex-col flex-grow">
                <img
                    alt={`${firstName} ${lastName}`}
                    src={photoUrl || 'https://via.placeholder.com/300?text=No+Image'}
                    className="w-28 h-28 mx-auto mb-4 rounded-full object-cover border-2 border-white ring-4 ring-blue-200"
                />
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{firstName} {lastName}</h2>
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
                  {about || 'No bio available.'}
                </p>
                <div className="flex justify-center gap-3 mt-auto">
                  {/* Secondary/Decline Button */}
                  <button 
                    onClick={() => reviewRequest("rejected", request._id)}
                    className='w-full flex items-center justify-center gap-2 border border-red-300 hover:bg-red-50 text-red-600 font-semibold py-2 px-3 rounded-lg transition duration-200'
                  >
                    <X size={16} /> Reject
                  </button>
                  {/* Primary/Accept Button */}
                  <button 
                    onClick={() => reviewRequest("accepted", request._id)}
                    className='w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-lg transition duration-200'
                  >
                    <Heart size={16} /> Accept
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Request;