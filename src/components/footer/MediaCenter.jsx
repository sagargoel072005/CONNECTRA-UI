const MediaCentre = () => {
  return (
    <main className="w-full min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center text-gray-900">
          Media Centre
        </h1>
        <p className="mb-6 leading-relaxed text-base sm:text-lg">
          Welcome to the Connectra Media Centre. Here you can find our latest press releases,
          company news, and resources for journalists and partners.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Press Releases</h2>
        <p className="mb-6 leading-relaxed">
          Stay updated with our latest announcements and company developments.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Media Resources</h2>
        <p className="mb-6 leading-relaxed">
          Download our brand assets, logos, and official guidelines for using our visual identity.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Media Relations</h2>
        <p className="mb-6 leading-relaxed">
          For press inquiries, please email us at <a href="mailto:press@Connectra.com" className="text-blue-600 hover:underline">press@Connectra.com</a>.
        </p>

        <p className="text-sm text-gray-500">Last updated: July 2026</p>
      </div>
    </main>
  );
};

export default MediaCentre;