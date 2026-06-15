import axios from 'axios';
import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaCrown, FaMedal } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';
import SubscriptionStatus from './SubscriptionStatus';

const Premium = () => {
    const [subscription, setSubscription] = useState({ status: 'free', type: null });
    const navigate = useNavigate();

    useEffect(() => {
        verifyPremiumUser();
    }, []);

    const verifyPremiumUser = async () => {
        try {

            const res = await axios.get(
                BASE_URL + "/premium/verify",
                {
                    withCredentials: true,
                }
            );

            if (res.data.isPremium) {

                navigate("/subscription-status", {
                    replace: true,
                    state: {
                        membershipType: res.data.membershipType,
                    },
                });

                return;
            }

            setSubscription({
                status: "free",
                type: null,
            });

        } catch (error) {

            console.log(error);

        }
    };
    const handleBuyClick = async (type) => {
        try {
            const order = await axios.post(
                BASE_URL + "/payment/create",
                { membershipType: type },
                { withCredentials: true }
            );

            const { amount, keyId, currency, notes, orderId } = order.data;

            const options = {
                key: keyId,
                amount,
                currency,
                name: "CONNECTRA",
                description: `Purchase ${type.charAt(0).toUpperCase() + type.slice(1)} Membership`,
                order_id: orderId,
                prefill: {
                    name: `${notes.firstName} ${notes.lastName}`,
                    email: notes.emailId,
                    contact: "9999999999",
                },
                theme: {
                    color: "#2563EB", // Blue color for Razorpay modal
                },
                handler: async function () {

                    setTimeout(async () => {

                        await verifyPremiumUser();

                    }, 3000);

                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment initiation failed:", error);
        }
    };

    const features = [
        { name: 'Browse Profiles', free: true, silver: true, gold: true },
        { name: 'Send Connection Requests', free: '5 per day', silver: '50 per day', gold: 'Unlimited' },
        { name: 'See Who Liked You', free: false, silver: true, gold: true },
        { name: 'Advanced Search Filters', free: false, silver: true, gold: true },
        { name: 'Video Call with Matches', free: false, silver: '10 mins/call', gold: 'Unlimited' },
        { name: 'Profile Boost', free: false, silver: '1 per month', gold: '5 per month' },
        { name: 'Ad-Free Experience', free: false, silver: true, gold: true },
        { name: 'Priority Support', free: false, silver: false, gold: true },
    ];

    // If user is free, show the plans
    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-600">Choose Your Plan</h1>
                    <p className="mt-4 text-lg text-gray-600">Unlock your full potential and connect with developers worldwide.</p>
                </div>

                <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-200">
                    <table className="w-full text-sm sm:text-base">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left p-4 sm:p-6 font-bold text-lg text-gray-800">Features</th>
                                {/* Free Plan */}
                                <th className="text-center p-4 sm:p-6">
                                    <h2 className="font-semibold text-lg text-gray-700">Free</h2>
                                    <p className="text-gray-500 text-xs sm:text-sm font-normal">Basic Access</p>
                                </th>
                                {/* Silver Plan (Featured) */}
                                <th className="text-center p-4 sm:p-6 border-x-2 border-blue-200 bg-blue-50">
                                    <div className="flex items-center justify-center gap-2">
                                        <FaMedal className="text-blue-500" />
                                        <h2 className="font-bold text-lg text-blue-800">Silver</h2>
                                    </div>
                                    <p className="text-blue-700 text-xs sm:text-sm font-normal">More Connections</p>
                                </th>
                                {/* Gold Plan */}
                                <th className="text-center p-4 sm:p-6">
                                    <div className="flex items-center justify-center gap-2">
                                        <FaCrown className="text-yellow-500" />
                                        <h2 className="font-bold text-lg text-gray-800">Gold</h2>
                                    </div>
                                    <p className="text-gray-500 text-xs sm:text-sm font-normal">All Access</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature, index) => (
                                <tr key={index} className="border-b border-gray-200 last:border-b-0">
                                    <td className="p-4 sm:p-6 font-medium text-gray-700">{feature.name}</td>
                                    <td className="text-center p-4 sm:p-6">
                                        {typeof feature.free === 'boolean' ? (
                                            feature.free ? <FaCheck className="mx-auto text-green-500" /> : <FaTimes className="mx-auto text-red-500" />
                                        ) : (
                                            <span className="font-mono text-gray-600">{feature.free}</span>
                                        )}
                                    </td>
                                    <td className="text-center p-4 sm:p-6 bg-blue-50 border-x-2 border-blue-200">
                                        {typeof feature.silver === 'boolean' ? (
                                            feature.silver ? <FaCheck className="mx-auto text-green-500" /> : <FaTimes className="mx-auto text-red-500" />
                                        ) : (
                                            <span className="font-mono text-blue-700">{feature.silver}</span>
                                        )}
                                    </td>
                                    <td className="text-center p-4 sm:p-6">
                                        {typeof feature.gold === 'boolean' ? (
                                            feature.gold ? <FaCheck className="mx-auto text-green-500" /> : <FaTimes className="mx-auto text-red-500" />
                                        ) : (
                                            <span className="font-mono text-yellow-600">{feature.gold}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {/* Action Buttons Row */}
                            <tr className="bg-gray-50">
                                <td className="p-6"></td>
                                <td className="text-center p-4 sm:p-6">
                                    <button onClick={() => navigate('/')} className="font-bold text-gray-600 hover:text-blue-600 transition duration-200">
                                        Continue Free
                                    </button>
                                </td>
                                <td className="text-center p-4 sm:p-6 bg-blue-50 border-x-2 border-b-2 border-blue-200 rounded-b-lg">
                                    <button onClick={() => handleBuyClick("silver")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 w-full">
                                        Choose Silver
                                    </button>
                                </td>
                                <td className="text-center p-4 sm:p-6">
                                    <button onClick={() => handleBuyClick("gold")} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 w-full">
                                        Choose Gold
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Premium;