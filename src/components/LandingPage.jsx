// import { motion } from "framer-motion";
// import {
//   Users,
//   Code2,
//   ShieldCheck,
//   FolderGit2,
//   Network,
//   Laptop2,
//   Share2,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const LandingPage = () => {
//   const navigate = useNavigate();

//   const containerVariants = {
//     hidden: {},
//     show: {
//       transition: {
//         staggerChildren: 0.15,
//       },
//     },
//   };

//   const fadeUpVariant = {
//     hidden: { opacity: 0, y: 40 },
//     show: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: "spring",
//         stiffness: 50,
//         damping: 10,
//       },
//     },
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-tr from-white via-blue-50 to-white font-sans text-gray-800">
//       {/* Navbar */}
//       <nav className="flex justify-between items-center px-8 py-5 shadow-sm bg-white/90 backdrop-blur-md sticky top-0 z-50">
//         <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//           <Code2 className="text-blue-600" />
//           CodeConnect
//         </div>

//         <button
//           onClick={() => navigate("/login")}
//           className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition duration-300 shadow-md"
//         >
//           Sign in
//         </button>
//       </nav>

//       {/* Hero Section */}
//       <section className="flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-20 py-20 gap-10">
//         {/* Left */}
//         <motion.div
//           className="md:w-1/2 text-center md:text-left space-y-6"
//           variants={fadeUpVariant}
//           initial="hidden"
//           animate="show"
//         >
//           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
//             Connect with <br className="hidden md:block" />
//             <span className="text-blue-600">Developers Worldwide</span>
//           </h1>
//           <p className="text-gray-600 text-lg">
//             Collaborate, build, and grow together — all in one platform.
//           </p>
//           <div className="flex justify-center md:justify-start gap-4 pt-2">
//             <button
//               onClick={() => navigate("/login")}
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
//             >
//               Get Started
//             </button>
//             <button className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100 transition shadow-sm">
//               Learn More
//             </button>
//           </div>
//         </motion.div>

//         {/* Right */}
//         <motion.div
//           className="md:w-1/2 flex justify-center relative"
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ type: "spring", duration: 1 }}
//         >
//           <div className="relative w-72 h-72 md:w-96 md:h-96 bg-white/30 backdrop-blur-lg border border-blue-100 rounded-full shadow-lg flex items-center justify-center">
//             <div className="absolute top-2 left-2">
//               <Laptop2 className="text-blue-500 w-8 h-8" />
//             </div>
//             <div className="absolute top-2 right-2">
//               <Network className="text-blue-500 w-8 h-8" />
//             </div>
//             <div className="absolute bottom-2 left-2">
//               <Share2 className="text-blue-500 w-8 h-8" />
//             </div>
//             <div className="absolute bottom-2 right-2">
//               <Code2 className="text-blue-500 w-8 h-8" />
//             </div>
//             <Users className="text-blue-600 w-24 h-24" />
//           </div>
//         </motion.div>
//       </section>

//       {/* Features Section */}
//      <section className="bg-blue-50 py-10 px-8 md:px-20 mt-[-40px]">

//         <motion.div
//           className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-center"
//           variants={containerVariants}
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true }}
//         >
//           {[
//             {
//               icon: <Network className="text-blue-600 w-10 h-10 mx-auto" />,
//               title: "Networking",
//               desc: "Expand your network effortlessly.",
//             },
//             {
//               icon: <FolderGit2 className="text-blue-600 w-10 h-10 mx-auto" />,
//               title: "Collaboration",
//               desc: "Work together in real-time.",
//             },
//             {
//               icon: <ShieldCheck className="text-blue-600 w-10 h-10 mx-auto" />,
//               title: "Security",
//               desc: "Keep your projects secure.",
//             },
//           ].map((feature, idx) => (
//             <motion.div
//               key={idx}
//               className="p-6 bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300"
//               variants={fadeUpVariant}
//             >
//               {feature.icon}
//               <h3 className="font-semibold text-xl mt-4">{feature.title}</h3>
//               <p className="text-gray-600 mt-2">{feature.desc}</p>
//             </motion.div>
//           ))}
//         </motion.div>
//       </section>
//     </div>
//   );
// };

// export default LandingPage;


import { motion } from "framer-motion";
import {
Users,
Code2,
ShieldCheck,
FolderGit2,
Network,
Laptop2,
Share2,
Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const LandingPage = () => {
const navigate = useNavigate();

const [search, setSearch] = useState("");

const containerVariants = {
hidden: {},
show: {
transition: { staggerChildren: 0.15 },
},
};

const fadeUpVariant = {
hidden: { opacity: 0, y: 40 },
show: {
opacity: 1,
y: 0,
transition: { type: "spring", stiffness: 50, damping: 10 },
},
};

return ( <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#1a1a40] to-[#0f0c29] text-gray-200 overflow-hidden">


  {/* Glow Background */}
  <div className="absolute w-96 h-96 bg-blue-500/20 blur-3xl rounded-full top-[-120px] left-[-120px] animate-pulse"></div>
  <div className="absolute w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full bottom-[-120px] right-[-120px] animate-pulse"></div>

  {/* Navbar */}
  <nav className="flex justify-between items-center px-8 md:px-20 py-6 border-b border-white/10 backdrop-blur-xl">

    <div className="text-2xl font-bold flex items-center gap-2">
      <Code2 className="text-blue-500" />
      Connectra
    </div>

    <button
      onClick={() => navigate("/login")}
      className="bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2 rounded-lg hover:scale-105 transition"
    >
      Sign In
    </button>

  </nav>

  {/* HERO */}
  <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-24 gap-16">

    {/* LEFT */}
    <motion.div
      className="md:w-1/2 space-y-6"
      variants={fadeUpVariant}
      initial="hidden"
      animate="show"
    >

      <h1 className="text-4xl md:text-5xl font-bold leading-tight">
        Connect with
        <span className="block text-blue-400">
          Developers Worldwide
        </span>
      </h1>

      <p className="text-gray-400 text-lg">
        Discover developers, collaborate on projects, and grow your tech network.
      </p>



      {/* CTA */}
      <div className="flex gap-4 pt-2">

        <button
          onClick={() => navigate("/signup")}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-3 rounded-lg hover:scale-105 transition shadow-lg"
        >
          Get Started
        </button>

        <button className="border border-white/20 px-6 py-3 rounded-lg hover:bg-white/10 transition">
          Learn More
        </button>

      </div>

    </motion.div>

    {/* RIGHT GRAPHIC */}
    <motion.div
      className="md:w-1/2 flex justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", duration: 1 }}
    >

      <div className="relative w-80 h-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-xl">

        <div className="absolute top-4 left-4">
          <Laptop2 className="text-blue-400 w-8 h-8" />
        </div>

        <div className="absolute top-4 right-4">
          <Network className="text-blue-400 w-8 h-8" />
        </div>

        <div className="absolute bottom-4 left-4">
          <Share2 className="text-blue-400 w-8 h-8" />
        </div>

        <div className="absolute bottom-4 right-4">
          <Code2 className="text-blue-400 w-8 h-8" />
        </div>

        <Users className="text-blue-500 w-24 h-24" />

      </div>

    </motion.div>

  </section>

  {/* FEATURES */}
  <section className="px-8 md:px-20 pb-24">

    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >

      {[
        {
          icon: <Network className="text-blue-400 w-10 h-10 mx-auto" />,
          title: "Developer Networking",
          desc: "Meet developers from around the globe.",
        },
        {
          icon: <FolderGit2 className="text-blue-400 w-10 h-10 mx-auto" />,
          title: "Project Collaboration",
          desc: "Build and collaborate on projects.",
        },
        {
          icon: <ShieldCheck className="text-blue-400 w-10 h-10 mx-auto" />,
          title: "Secure Platform",
          desc: "Your data and projects stay safe.",
        },
      ].map((feature, idx) => (
        <motion.div
          key={idx}
          className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-center hover:scale-105 transition"
          variants={fadeUpVariant}
        >
          {feature.icon}
          <h3 className="font-semibold text-xl mt-4">{feature.title}</h3>
          <p className="text-gray-400 mt-2">{feature.desc}</p>
        </motion.div>
      ))}

    </motion.div>

  </section>

</div>


);
};

export default LandingPage;
