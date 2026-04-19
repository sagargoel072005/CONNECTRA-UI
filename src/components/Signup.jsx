import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/solid";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {

const [emailId, setEmailId] = useState("");
const [password, setPassword] = useState("");
const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);

const dispatch = useDispatch();
const navigate = useNavigate();

const handleSignup = async (e) => {
e.preventDefault();


if (!firstName || !lastName || !emailId || !password) {
  setError("All fields are required");
  return;
}

try {
  setLoading(true);

  const res = await axios.post(
    BASE_URL + "/signup",
    {
      firstName,
      lastName,
      emailId: emailId.trim(),
      password
    },
    { withCredentials: true }
  );

  dispatch(addUser(res.data));
  navigate("/profile");

} catch (err) {
  setError(err?.response?.data?.message || "Signup failed");
} finally {
  setLoading(false);
}


};

return ( <div className="relative min-h-screen flex items-center justify-center 
                 bg-gradient-to-br from-[#0f0c29] via-[#1a1a40] to-[#0f0c29] 
                 overflow-hidden px-4">


  {/* Glow Background */}
  <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl top-[-100px] left-[-100px] animate-pulse"></div>
  <div className="absolute w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl bottom-[-100px] right-[-100px] animate-pulse"></div>

  <div className="w-full max-w-6xl bg-white/5 backdrop-blur-xl 
                  border border-white/10 rounded-3xl 
                  shadow-[0_0_60px_rgba(0,0,255,0.25)] 
                  flex overflow-hidden z-10">

    {/* LEFT PANEL */}
    <div className="hidden md:flex w-1/2 relative items-center justify-center">

      <div className="absolute w-[500px] h-[500px] 
                      bg-white/10 backdrop-blur-2xl 
                      rounded-[40%_60%_55%_45%/55%_45%_55%_45%] 
                      animate-[spin_30s_linear_infinite]">
      </div>

      <div className="relative flex flex-col items-center z-10">

        <div className="w-40 h-40 bg-gradient-to-br 
                        from-blue-500 to-indigo-600 
                        rounded-full shadow-2xl 
                        flex items-center justify-center
                        animate-pulse">
          <span className="text-white text-4xl font-bold">C</span>
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-3">
            Connectra
          </h2>
          <p className="text-gray-300">
            Connect. <br /> Collaborate. <br /> Grow.
          </p>
        </div>

      </div>

    </div>

    {/* RIGHT PANEL */}
    <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">

      <h1 className="text-4xl font-bold text-white mb-2">
        Create Account
      </h1>

      <p className="text-gray-400 mb-8">
        Join Connectra and start networking
      </p>

      <form
        onSubmit={handleSignup}
        autoComplete="off"
        className="space-y-5"
      >

        {/* First Name */}
        <div className="relative">
          <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            autoComplete="off"
            placeholder="First Name"
            className="pl-10 w-full bg-white/10 text-white rounded-xl py-3 px-4 outline-none"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {/* Last Name */}
        <div className="relative">
          <UserIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            autoComplete="off"
            placeholder="Last Name"
            className="pl-10 w-full bg-white/10 text-white rounded-xl py-3 px-4 outline-none"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="relative">
          <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="email"
            autoComplete="off"
            placeholder="Email"
            className="pl-10 w-full bg-white/10 text-white rounded-xl py-3 px-4 outline-none"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="relative">

          <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />

          <input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Password"
            className="pl-10 pr-10 w-full bg-white/10 text-white rounded-xl py-3 px-4 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-300"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>

        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-medium text-white
                     bg-gradient-to-r from-blue-500 to-indigo-600
                     hover:scale-105 transition-all duration-300"
        >
          {loading ? "Processing..." : "Signup"}
        </button>

        {/* Switch to login */}
        <p className="text-center text-sm text-blue-400 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>

      </form>

    </div>

  </div>
</div>


);
};

export default Signup;
