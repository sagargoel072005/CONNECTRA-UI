import { useEffect, useRef } from "react";

const ShippingAndDeliveryPolicy = () => {
  // 🔹 Ref for background stars
  const rootRef = useRef(null);

  // 🔹 Generate subtle background stars
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    for (let i = 0; i < 40; i++) {
      const star = document.createElement("div");
      star.className =
        "absolute w-[2px] h-[2px] bg-white/40 rounded-full";

      star.style.top = Math.random() * 100 + "%";
      star.style.left = Math.random() * 100 + "%";

      root.appendChild(star);
    }
  }, []);

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-gradient-to-br from-[#0a0820] via-[#12104a] to-[#05030f] text-white px-6 py-20 relative overflow-hidden"
    >
      {/* 🔹 Background Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full" />

      {/* 🔹 Container */}
      <div className="max-w-3xl mx-auto relative z-10">

        {/* 🔹 Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-indigo-300 bg-indigo-500/10 px-4 py-1 rounded-full border border-indigo-400/20">
            Policy
          </span>

          <h1 className="mt-4 text-4xl md:text-5xl font-semibold bg-gradient-to-r from-indigo-200 via-indigo-400 to-purple-400 text-transparent bg-clip-text">
            Shipping & Delivery
          </h1>

          <p className="mt-4 text-indigo-200/60 text-sm max-w-md mx-auto">
            Learn how our digital delivery process works and when you can expect access to your services.
          </p>
        </div>

        {/* 🔹 Content Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] space-y-6">

          {/* 🔹 Section 1 */}
          <div>
            <h2 className="text-lg font-semibold text-indigo-300 mb-2">
              Digital Services Only
            </h2>
            <p className="text-indigo-200/70 text-sm leading-relaxed">
              We provide digital services only. Therefore, no physical shipping
              is required or applicable for any of our products.
            </p>
          </div>

          {/* 🔹 Section 2 */}
          <div>
            <h2 className="text-lg font-semibold text-indigo-300 mb-2">
              Delivery Time
            </h2>
            <p className="text-indigo-200/70 text-sm leading-relaxed">
              Once your payment is successfully completed, access credentials
              or activation details are delivered to your registered email
              within 1 hour.
            </p>
          </div>

          {/* 🔹 Section 3 */}
          <div>
            <h2 className="text-lg font-semibold text-indigo-300 mb-2">
              Delay or Issues
            </h2>
            <p className="text-indigo-200/70 text-sm leading-relaxed">
              If you experience any delay in receiving your access details,
              please contact our support team immediately.
            </p>
            <p className="text-indigo-300 font-medium mt-2">
              support@connectra.com
            </p>
          </div>

          {/* 🔹 Footer Note */}
          <div className="pt-4 border-t border-white/10 text-xs text-indigo-200/40">
            Last updated: July 2026
          </div>

        </div>

      </div>
    </div>
  );
};

export default ShippingAndDeliveryPolicy;