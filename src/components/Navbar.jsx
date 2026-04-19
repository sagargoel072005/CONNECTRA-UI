
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { Code2 } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
const user = useSelector((store) => store.user);
const dispatch = useDispatch();
const navigate = useNavigate();

const [open, setOpen] = useState(false);

const handleLogout = async () => {
try {
await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
dispatch(removeUser());
navigate("/login");
} catch (err) {
console.error(err);
}
};

return ( <nav className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10"> <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">


    {/* Logo */}
    <Link to="/feed" className="flex items-center gap-2">
      <Code2 className="text-blue-500" />
      <span className="text-white font-bold text-lg">Connectra</span>
    </Link>

    {/* Avatar */}
    {user && (
      <div className="relative">

        <div
          onClick={() => setOpen(!open)}
          className="cursor-pointer w-10 h-10 rounded-full overflow-hidden border border-white/20"
        >
          <img
            src={
              user.photoUrl ||
              "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            }
            alt="user"
          />
        </div>

        {/* Floating Menu */}
        {open && (
          <div className="absolute right-0 mt-4 w-56 
                          bg-[#1a1a40] text-gray-300 
                          rounded-2xl shadow-xl 
                          border border-white/10
                          backdrop-blur-xl p-4 space-y-3">

            <Link to="/profile" className="block hover:text-white">
              Profile
            </Link>

            <Link to="/user/connections" className="block hover:text-white">
              Connections
            </Link>

            <Link to="/requests" className="block hover:text-white">
              Requests
            </Link>

            <Link to="/premium" className="block hover:text-white">
              Premium
            </Link>

            <Link to="/tech-news" className="block hover:text-white">
              Tech News
            </Link>

            <div className="border-t border-white/10 my-2"></div>

            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300"
            >
              Logout
            </button>

          </div>
        )}

      </div>
    )}

  </div>
</nav>


);
};

export default Navbar;
