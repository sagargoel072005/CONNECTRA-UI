
// import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <footer className="bg-gradient-to-br from-[#0f0c29] via-[#1a1a40] to-[#0f0c29] 
//                        text-gray-300 py-10 px-6 md:px-20 border-t border-white/10">

//       <div className="max-w-6xl mx-auto">

//         {/* Social Icons */}
//         <div className="flex justify-center space-x-6 mb-8">
//           <button className="p-3 rounded-full bg-white/10 backdrop-blur-md 
//                              hover:bg-blue-600 transition-all duration-300">
//             <FaFacebookF />
//           </button>

//           <button className="p-3 rounded-full bg-white/10 backdrop-blur-md 
//                              hover:bg-pink-500 transition-all duration-300">
//             <FaInstagram />
//           </button>

//           <button className="p-3 rounded-full bg-white/10 backdrop-blur-md 
//                              hover:bg-blue-400 transition-all duration-300">
//             <FaTwitter />
//           </button>

//           <button className="p-3 rounded-full bg-white/10 backdrop-blur-md 
//                              hover:bg-red-600 transition-all duration-300">
//             <FaYoutube />
//           </button>
//         </div>

//         {/* Footer Links */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-sm text-center">

//           <ul className="space-y-3">
//             <li><Link to="/terms-and-conditions" className="hover:text-blue-400">Terms & Conditions</Link></li>
//             <li><Link to="/privacy-policy" className="hover:text-blue-400">Privacy Policy</Link></li>
//             <li><Link to="/contact-us" className="hover:text-blue-400">Contact Us</Link></li>
//           </ul>

//           <ul className="space-y-3">
//             <li><Link to="/cancellation-and-refund-policy" className="hover:text-blue-400">Cancellation</Link></li>
//             <li><Link to="/shipping-and-delivery-policy" className="hover:text-blue-400">Shipping</Link></li>
//             <li><Link to="/media-centre" className="hover:text-blue-400">Media Centre</Link></li>
//           </ul>

//           <ul className="space-y-3">
//             <li><Link to="/refund-policy" className="hover:text-blue-400">Refund Policy</Link></li>
//             <li><Link to="/delivery-policy" className="hover:text-blue-400">Delivery Policy</Link></li>
//             <li><Link to="/about-us" className="hover:text-blue-400">About Us</Link></li>
//           </ul>

//           <ul className="space-y-3">
//             <li><Link to="/faq" className="hover:text-blue-400">FAQ</Link></li>
//             <li><Link to="/support" className="hover:text-blue-400">Support</Link></li>
//             <li><Link to="/careers" className="hover:text-blue-400">Careers</Link></li>
//           </ul>

//         </div>

//         {/* Service Code Button */}
//         <div className="mt-8 flex justify-center">
//           <button className="border border-white/20 text-gray-200 py-2 px-5 text-sm 
//                              rounded-lg hover:bg-white/10 transition">
//             Service Code
//           </button>
//         </div>

//         {/* Copyright */}
//         <div className="text-center mt-8 text-xs text-gray-400">
//           © 2026 Connectra. All rights reserved.
//         </div>

//       </div>
//     </footer>
//   );
// };

// export default Footer;


import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
return ( <footer className="relative bg-gradient-to-br from-[#0f0c29] via-[#1a1a40] to-[#0f0c29] 
                    text-gray-300 py-12 px-6 md:px-20 border-t border-white/10 overflow-hidden">


  {/* Glow background */}
  <div className="absolute w-72 h-72 bg-blue-500/20 blur-3xl rounded-full top-[-80px] left-[-80px] animate-pulse"></div>
  <div className="absolute w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full bottom-[-80px] right-[-80px] animate-pulse"></div>

  <div className="relative max-w-6xl mx-auto">

    

    {/* Social icons */}
    <div className="flex justify-center gap-6 mb-10">

      <button className="p-3 rounded-full bg-white/10 backdrop-blur-md 
                         hover:bg-blue-600 hover:scale-110 transition duration-300 shadow-lg">
        <FaFacebookF />
      </button>

      <button className="p-3 rounded-full bg-white/10 backdrop-blur-md 
                         hover:bg-pink-500 hover:scale-110 transition duration-300 shadow-lg">
        <FaInstagram />
      </button>

      <button className="p-3 rounded-full bg-white/10 backdrop-blur-md 
                         hover:bg-blue-400 hover:scale-110 transition duration-300 shadow-lg">
        <FaTwitter />
      </button>

      <button className="p-3 rounded-full bg-white/10 backdrop-blur-md 
                         hover:bg-red-600 hover:scale-110 transition duration-300 shadow-lg">
        <FaYoutube />
      </button>

    </div>

    {/* Links */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 text-sm text-center">

      <ul className="space-y-3">
        <li><Link to="/terms-and-conditions" className="hover:text-blue-400 transition">Terms & Conditions</Link></li>
        <li><Link to="/privacy-policy" className="hover:text-blue-400 transition">Privacy Policy</Link></li>
        <li><Link to="/contact-us" className="hover:text-blue-400 transition">Contact Us</Link></li>
      </ul>

      <ul className="space-y-3">
        <li><Link to="/cancellation-and-refund-policy" className="hover:text-blue-400 transition">Cancellation</Link></li>
        <li><Link to="/shipping-and-delivery-policy" className="hover:text-blue-400 transition">Shipping</Link></li>
        <li><Link to="/media-centre" className="hover:text-blue-400 transition">Media Centre</Link></li>
      </ul>

      <ul className="space-y-3">
        <li><Link to="/refund-policy" className="hover:text-blue-400 transition">Refund Policy</Link></li>
        <li><Link to="/delivery-policy" className="hover:text-blue-400 transition">Delivery Policy</Link></li>
        <li><Link to="/about-us" className="hover:text-blue-400 transition">About Us</Link></li>
      </ul>

      <ul className="space-y-3">
        <li><Link to="/faq" className="hover:text-blue-400 transition">FAQ</Link></li>
        <li><Link to="/support" className="hover:text-blue-400 transition">Support</Link></li>
        <li><Link to="/careers" className="hover:text-blue-400 transition">Careers</Link></li>
      </ul>

    </div>

    {/* Button */}
    <div className="mt-10 flex justify-center">
      <button className="px-6 py-2 rounded-lg 
                         bg-gradient-to-r from-blue-500 to-indigo-600
                         text-white text-sm font-medium
                         hover:scale-105 transition duration-300 shadow-lg">
        Service Code
      </button>
    </div>

    {/* Divider */}
    <div className="h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-8"></div>

    {/* Copyright */}
    <div className="text-center text-xs text-gray-400">
      © 2026 Connectra. All rights reserved.
    </div>

  </div>
</footer>


);
};

export default Footer;
