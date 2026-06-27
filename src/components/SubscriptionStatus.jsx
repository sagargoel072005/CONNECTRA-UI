import { FaCrown, FaMedal, FaCheck } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

const SubscriptionStatus = () => {
    const { state } = useLocation();
    const membershipType = state?.membershipType || "silver";
    const isGold = membershipType === "gold";

    const accent = isGold
        ? {
            ring: 'border-amber-400/30',
            glow: 'shadow-[0_0_50px_-12px_rgba(251,191,36,0.35)]',
            iconBg: 'bg-amber-500/10',
            iconColor: 'text-amber-400',
            text: 'text-amber-300',
            pulseBorder: 'border-amber-400/40',
            particle: 'bg-amber-300',
            particleGlow: 'rgba(251,191,36,0.8)',
            gradient: 'from-amber-300 to-yellow-400',
            button: 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-900 shadow-amber-500/25',
        }
        : {
            ring: 'border-violet-500/30',
            glow: 'shadow-[0_0_50px_-12px_rgba(124,58,237,0.4)]',
            iconBg: 'bg-violet-500/10',
            iconColor: 'text-violet-400',
            text: 'text-violet-300',
            pulseBorder: 'border-violet-400/40',
            particle: 'bg-violet-300',
            particleGlow: 'rgba(167,139,250,0.8)',
            gradient: 'from-violet-300 to-indigo-300',
            button: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-600/30',
        };

    const perks = isGold
        ? ['Unlimited connection requests', 'Unlimited video calls', 'Priority support, always']
        : ['50 connection requests every day', '10-minute video calls with matches', 'See who liked your profile'];

    // Particle burst positions — generated once per mount, not on every re-render
    const particles = useMemo(() => {
        const count = 14;
        return Array.from({ length: count }, (_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const distance = 65 + Math.random() * 35;
            return {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
                delay: Math.random() * 0.15,
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [membershipType]);

    return (
        <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-[#08070d] p-4 sm:p-6">
            {/* subtle starfield */}
            <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                    backgroundImage:
                        'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
            />
            <div className="pointer-events-none absolute -top-40 left-1/3 h-[28rem] w-[28rem] rounded-full bg-violet-700/[0.07] blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`relative w-full max-w-md rounded-2xl border ${accent.ring} bg-white/[0.03] backdrop-blur-sm p-6 sm:p-8 ${accent.glow}`}
            >
                <div className="text-center">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className={`text-[11px] font-semibold uppercase tracking-[0.2em] mb-4 ${accent.text}`}
                    >
                        Payment Confirmed
                    </motion.p>

                    {/* Badge with pulse rings + particle burst */}
                    <div className="relative mx-auto mb-5 h-20 w-20 sm:h-24 sm:w-24">
                        {[0, 1, 2].map((ringIdx) => (
                            <motion.span
                                key={ringIdx}
                                className={`absolute inset-0 rounded-full border ${accent.pulseBorder}`}
                                initial={{ scale: 1, opacity: 0.5 }}
                                animate={{ scale: 1.9, opacity: 0 }}
                                transition={{
                                    duration: 2.2,
                                    repeat: Infinity,
                                    delay: ringIdx * 0.6,
                                    ease: 'easeOut',
                                }}
                            />
                        ))}

                        {particles.map((p, i) => (
                            <motion.span
                                key={i}
                                className={`absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full ${accent.particle}`}
                                style={{ boxShadow: `0 0 6px 1px ${accent.particleGlow}` }}
                                initial={{ x: 0, y: 0, opacity: 1 }}
                                animate={{ x: p.x, y: p.y, opacity: 0 }}
                                transition={{ duration: 0.9, delay: 0.25 + p.delay, ease: 'easeOut' }}
                            />
                        ))}

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                            className={`relative z-10 flex h-full w-full items-center justify-center rounded-full ${accent.iconBg}`}
                        >
                            {isGold ? (
                                <FaCrown className={`text-4xl sm:text-5xl ${accent.iconColor}`} />
                            ) : (
                                <FaMedal className={`text-4xl sm:text-5xl ${accent.iconColor}`} />
                            )}
                        </motion.div>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        You're a{' '}
                        <span className={`bg-gradient-to-r ${accent.gradient} bg-clip-text text-transparent`}>
                            {isGold ? 'Gold' : 'Silver'}
                        </span>{' '}
                        Member!
                    </h1>
                    <p className="text-slate-400 text-sm sm:text-base mb-6">
                        You have unlocked exclusive features. Make the most of your premium experience.
                    </p>

                    <div className="text-left bg-white/5 border border-white/10 rounded-xl p-4">
                        <h2 className="font-semibold text-xs sm:text-sm uppercase tracking-wide text-slate-400 mb-1">
                            Your current plan
                        </h2>
                        <p className={`capitalize font-mono text-lg sm:text-xl ${accent.text}`}>
                            {membershipType}
                        </p>
                    </div>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } },
                        }}
                        className="mt-5 space-y-2.5 text-left"
                    >
                        {perks.map((perk) => (
                            <motion.div
                                key={perk}
                                variants={{
                                    hidden: { opacity: 0, x: -8 },
                                    visible: { opacity: 1, x: 0 },
                                }}
                                className="flex items-center gap-2.5 text-sm text-slate-300"
                            >
                                <FaCheck className={`shrink-0 text-xs ${accent.text}`} />
                                <span>{perk}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    <Link to="/feed">
                        <button className={`mt-8 w-full py-3 rounded-xl font-semibold transition-all duration-300 ${accent.button} shadow-lg`}>
                            Back to Homepage
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default SubscriptionStatus;