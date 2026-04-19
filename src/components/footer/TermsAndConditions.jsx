const TermsAndConditions = () => {
  return (
    <main className="w-full min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center text-gray-900">
          Terms and Conditions
        </h1>
        <p className="mb-6 leading-relaxed text-base sm:text-lg">
          These Terms and Conditions govern your use of our website and services.
        </p>

        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>You agree to use our platform responsibly and lawfully.</li>
          <li>Payments should be made through approved channels only.</li>
          <li>
            All content is owned by <strong>[Your Company]</strong> and may not be copied without permission.
          </li>
        </ul>

        <p className="leading-relaxed text-base sm:text-lg mb-4">
          By using our service, you agree to these terms. If you do not agree, please do not use the site.
        </p>

        <p className="text-sm text-gray-500">Effective date: July 2026</p>
      </div>
    </main>
  );
};

export default TermsAndConditions;