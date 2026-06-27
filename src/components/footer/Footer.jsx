import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  // 🔹 Modal state (open/close)
  const [openModal, setOpenModal] = useState(false);

  // 🔹 Service code input state
  const [code, setCode] = useState("");

  // 🔹 Handle submit
  const handleSubmit = () => {
    console.log("Entered Code:", code);

    // 👉 Demo validation (replace with backend later)
    if (code === "CONNECTRA2026") {
      alert("Valid Code 🎉");
    } else {
      alert("Invalid Code ❌");
    }

    setOpenModal(false);
    setCode("");
  };

  return (
    <>
      <footer
        className="relative bg-gradient-to-br from-[#0f0c29] via-[#1a1a40] to-[#0f0c29] 
        text-gray-300 py-12 px-6 md:px-20 border-t border-white/10 overflow-hidden"
      >
        {/* 🔹 Background Glow */}
        <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full top-[-80px] left-[-80px]" />
        <div className="absolute w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full bottom-[-80px] right-[-80px]" />

        <div className="relative max-w-6xl mx-auto">

          {/* 🔹 Social Icons */}
          <div className="flex justify-center gap-6 mb-10">
            <div className="flex justify-center gap-6 mb-10">

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/10 hover:bg-blue-600 hover:scale-110 transition"
              >
                <FaFacebookF />
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/10 hover:bg-pink-500 hover:scale-110 transition"
              >
                <FaInstagram />
              </a>

              {/* Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/10 hover:bg-blue-400 hover:scale-110 transition"
              >
                <FaTwitter />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/10 hover:bg-red-600 hover:scale-110 transition"
              >
                <FaYoutube />
              </a>

            </div>
          </div>

          {/* 🔹 Links (UNCHANGED ROUTES ✅) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 text-sm text-center">

            <ul className="space-y-3">
              <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
            </ul>

            <ul className="space-y-3">
              <li><Link to="/cancellation-and-refund-policy">Cancellation</Link></li>
              <li><Link to="/shipping-and-delivery-policy">Shipping</Link></li>
            </ul>

            <ul className="space-y-3">
              <li><Link to="/refund-policy">Refund Policy</Link></li>
              <li><Link to="/delivery-policy">Delivery Policy</Link></li>
            </ul>

            <ul className="space-y-3">
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/careers">Careers</Link></li>
            </ul>

          </div>

          {/* 🔥 SERVICE CODE BUTTON */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setOpenModal(true)}
              className="px-6 py-2 rounded-lg 
              bg-gradient-to-r from-blue-500 to-indigo-600
              text-white text-sm font-medium
              hover:scale-105 transition shadow-lg"
            >
              Service Code
            </button>
          </div>

          {/* 🔹 Divider */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-8" />

          {/* 🔹 Copyright */}
          <div className="text-center text-xs text-gray-400">
            © 2026 Connectra. All rights reserved.
          </div>

        </div>
      </footer>

      {/* 🔥 MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-[#0f0c29] border border-white/10 rounded-2xl p-6 w-[90%] max-w-md text-center">

            <h2 className="text-xl font-semibold text-white mb-4">
              Enter Service Code
            </h2>

            {/* Input */}
            <input
              type="text"
              placeholder="Enter your code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none mb-4"
            />

            {/* Buttons */}
            <div className="flex gap-3">

              <button
                onClick={() => setOpenModal(false)}
                className="flex-1 py-2 rounded-lg bg-gray-600 hover:bg-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="flex-1 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600"
              >
                Submit
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Footer;