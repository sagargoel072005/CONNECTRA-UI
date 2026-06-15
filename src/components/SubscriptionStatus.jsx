import { FaCrown, FaMedal } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";


const SubscriptionStatus = () => {
    const { state } = useLocation();

    const membershipType =
        state?.membershipType || "silver";

    const isGold =
        membershipType === "gold";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-6">
            <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl border ${isGold ? 'border-yellow-300 bg-white' : 'border-gray-200 bg-white'}`}>
                <div className="text-center">
                    {isGold ? (
                        <FaCrown className="text-6xl text-yellow-500 mx-auto mb-4" />
                    ) : (
                        <FaMedal className="text-6xl text-blue-500 mx-auto mb-4" />
                    )}
                    <h1 className="text-3xl font-bold mb-2">You are a {isGold ? 'Gold' : 'Silver'} Member!</h1>
                    <p className="text-gray-500 mb-6">You have unlocked exclusive features. Make the most of your premium experience.</p>
                    <div className="text-left bg-gray-100 p-4 rounded-lg border border-gray-200">
                        <h2 className="font-semibold text-lg mb-2 text-gray-700">Your current plan:</h2>
                        <p className="capitalize text-blue-600 font-mono text-xl">{membershipType}</p>
                    </div>
                    <Link to="/feed">
                        <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                            Back to Homepage
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionStatus;