const PrivacyPolicy = () => {
  return (
    <main className="w-full min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center text-gray-900">
          Privacy Policy
        </h1>
        <p className="mb-6 leading-relaxed text-base sm:text-lg">
          At Connectra, we value your privacy. This Privacy Policy explains how we collect,
          use, and share your personal information.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
        <p className="mb-6 leading-relaxed">
          We collect information such as your name, email, and usage data to improve our services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p className="mb-6 leading-relaxed">
          We use your data to provide our services, process payments, and communicate updates.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
        <p className="mb-6 leading-relaxed">
          You can request access to or deletion of your data at any time by contacting us.
        </p>

        <p className="text-sm text-gray-500">Last updated: July 2026</p>
      </div>
    </main>
  );
};

export default PrivacyPolicy;