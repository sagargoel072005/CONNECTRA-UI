import axios from 'axios';
import { Heart, X, UserCircle } from 'lucide-react';
import { BASE_URL } from '../../utils/constants';
import { useDispatch } from 'react-redux';
import { removeFeed } from '../../utils/feedSlice';
const UserCard = ({ user,onAction }) => {
  const { _id , firstName, lastName, photoUrl, age, gender, about, location } = user;
const dispatch = useDispatch();
const handleSendRequest = async (status,userId) => {

  try{
    const res = await axios.post(BASE_URL+ "/request/send/"+ status + "/" + userId , {} ,{
      withCredentials:true,
    })
    dispatch(removeFeed(userId)); 
  }catch(err){
    console.error(err);
  }

}

return(
  <div className="w-80 h-[520px] bg-white rounded-3xl shadow-md border border-gray-200 hover:shadow-xl transition duration-300 overflow-hidden flex flex-col">

  <div className="relative w-full h-80">
    <img
      src={photoUrl || "https://via.placeholder.com/400x300?text=No+Image"}
      alt={`${firstName} ${lastName}`}
      className="w-full h-full object-cover"
    />
    <span className="absolute top-3 right-3 bg-white text-gray-700 text-xs font-medium px-3 py-1 rounded-full shadow">
      {gender}
    </span>
  </div>

  <div className="flex-1 px-5 py-4 flex flex-col justify-between">
    <div className="text-center">
      <h2 className="text-lg font-semibold text-gray-800 flex justify-center items-center gap-2">
        <UserCircle size={20} /> {firstName} {lastName}
      </h2>
      <p className="text-sm text-gray-500 mt-1">{age} years old {location ? `• ${location}` : ""}</p>
      <p className="text-sm text-gray-600 mt-3 italic line-clamp-3">
        {about || "This user hasn't shared anything yet."}
      </p>
    </div>

    <div className="flex justify-center gap-4 mt-6">
      <button
        onClick={() => handleSendRequest("ignored", _id)}
        className="px-4 py-2 text-sm text-red-500 border border-red-200 hover:bg-red-50 rounded-full transition duration-200"
      >
        <X className="inline mr-1" size={16} /> Ignore
      </button>
      <button
        onClick={() => handleSendRequest("interested", _id)}
        className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-full transition duration-200"
      >
        <Heart className="inline mr-1" size={16} /> Interested
      </button>
    </div>
  </div>
</div>

)};

export default UserCard;