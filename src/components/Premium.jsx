import axios from 'axios';
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaCrown, FaMedal } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/constants';

const Premium = () => {
    const [loadingTier, setLoadingTier] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        verifyPremiumUser();
    }, []);

    const verifyPremiumUser = async () => {
        try {
            const res = await axios.get(BASE_URL + "/premium/verify", {
                withCredentials: true,
            });

            if (res.data.isPremium) {
                navigate("/subscription-status", {
                    replace: true,
                    state: {
                        membershipType: res.data.membershipType,
                    },
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleBuyClick = async (type) => {
        try {
            setLoadingTier(type);
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
                    color: "#7c3aed",
                },
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(
                            BASE_URL + "/payment/verify",
                            {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                            { withCredentials: true }
                        );

                        if (verifyRes.data.isPremium) {
                            navigate("/subscription-status", {
                                replace: true,
                                state: { membershipType: verifyRes.data.membershipType },
                            });
                        }
                    } catch (err) {
                        console.error("Verification failed:", err);
                        alert("Payment verification failed. Please contact support if amount was deducted.");
                    } finally {
                        setLoadingTier(null);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setLoadingTier(null);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment initiation failed:", error);
            setLoadingTier(null);
        }
    };

    const features = [
        { name: 'Browse Profiles', free: true, silver: true, gold: true },
        { name: 'Send Connection Requests', free: '5 / day', silver: '50 / day', gold: 'Unlimited' },
        { name: 'See Who Liked You', free: false, silver: true, gold: true },
        { name: 'Advanced Search Filters', free: false, silver: true, gold: true },
        { name: 'Video Call with Matches', free: false, silver: '10 mins/call', gold: 'Unlimited' },
        { name: 'Profile Boost', free: false, silver: '1 / month', gold: '5 / month' },
        { name: 'Ad-Free Experience', free: false, silver: true, gold: true },
        { name: 'Priority Support', free: false, silver: false, gold: true },
    ];

    const renderValue = (value, activeColor) => {
        if (typeof value === 'boolean') {
            return value ? (
                <FaCheck className="mx-auto text-base text-emerald-400" />
            ) : (
                <FaTimes className="mx-auto text-base text-slate-600" />
            );
        }
        return <span className={`font-mono text-xs sm:text-sm ${activeColor}`}>{value}</span>;
    };

    const plans = [
        {
            key: 'free',
            title: 'Free',
            tagline: 'Basic Access',
            icon: null,
            ring: 'border-white/10',
            glow: '',
            badge: null,
            accent: 'text-slate-300',
            cta: (
                <button
                    onClick={() => navigate('/')}
                    className="w-full py-3 rounded-xl font-semibold text-slate-300 border border-white/15 hover:border-white/25 hover:bg-white/[0.04] transition-all duration-300"
                >
                    Continue Free
                </button>
            ),
        },
        {
            key: 'silver',
            title: 'Silver',
            tagline: 'More Connections',
            icon: <FaMedal className="text-xl text-violet-400" />,
            ring: 'border-violet-500/30',
            glow: 'shadow-[0_0_50px_-12px_rgba(124,58,237,0.4)]',
            badge: 'Most Popular',
            accent: 'text-violet-300',
            cta: (
                <button
                    onClick={() => handleBuyClick('silver')}
                    disabled={loadingTier === 'silver'}
                    className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-600/30 transition-all duration-300 disabled:opacity-60"
                >
                    {loadingTier === 'silver' ? 'Processing...' : 'Choose Silver'}
                </button>
            ),
        },
        {
            key: 'gold',
            title: 'Gold',
            tagline: 'All Access',
            icon: <FaCrown className="text-xl text-amber-400" />,
            ring: 'border-amber-400/30',
            glow: 'shadow-[0_0_50px_-12px_rgba(251,191,36,0.35)]',
            badge: null,
            accent: 'text-amber-300',
            cta: (
                <button
                    onClick={() => handleBuyClick('gold')}
                    disabled={loadingTier === 'gold'}
                    className="w-full py-3 rounded-xl font-semibold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 shadow-lg shadow-amber-500/25 transition-all duration-300 disabled:opacity-60"
                >
                    {loadingTier === 'gold' ? 'Processing...' : 'Choose Gold'}
                </button>
            ),
        },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#08070d] p-4 sm:p-6 md:p-10">
            <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                    backgroundImage:
                        'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />
            <div className="pointer-events-none absolute -top-40 left-1/3 h-[28rem] w-[28rem] rounded-full bg-violet-700/[0.07] blur-3xl" />

            <div className="relative max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10 sm:mb-14"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
                        Choose Your{' '}
                        <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Plan
                        </span>
                    </h1>
                    <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-400 max-w-xl mx-auto">
                        Unlock your full potential and connect with developers worldwide.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.key}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.12 }}
                            whileHover={{ y: -4 }}
                            className={`relative flex flex-col rounded-2xl border ${plan.ring} bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 ${plan.glow} ${plan.key === 'silver' ? 'md:scale-[1.03]' : ''}`}
                        >
                            {plan.badge && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-[0_0_20px_-2px_rgba(124,58,237,0.6)]">
                                    {plan.badge}
                                </span>
                            )}

                            <div className="flex items-center gap-2 mb-1">
                                {plan.icon && (
                                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${plan.key === 'silver' ? 'bg-violet-500/10' : 'bg-amber-500/10'}`}>
                                        {plan.icon}
                                    </span>
                                )}
                                <h2 className={`font-bold text-xl ${plan.key === 'free' ? 'text-white' : plan.accent}`}>
                                    {plan.title}
                                </h2>
                            </div>
                            <p className="text-slate-500 text-xs sm:text-sm mb-6">{plan.tagline}</p>

                            <ul className="flex-1 space-y-3 mb-8">
                                {features.map((feature) => (
                                    <li key={feature.name} className="flex items-center justify-between gap-3 text-sm">
                                        <span className="text-slate-300">{feature.name}</span>
                                        <span className="shrink-0">
                                            {renderValue(feature[plan.key], plan.accent)}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {plan.cta}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Premium;