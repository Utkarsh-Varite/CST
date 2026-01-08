import React from "react";

const DownPage = () => {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <section className="max-w-md w-full text-center bg-white shadow-md rounded-2xl p-8">
        {/* Icon / Visual */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
            <span className="text-3xl">🛠️</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          We’re Under Maintenance
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          We’re making some improvements to our platform. Please check back
          again shortly.
        </p>

        {/* Optional Footer Info */}
        <div className="text-sm text-gray-400">
          Thank you for your patience 🙏
        </div>
      </section>
    </main>
  );
};

export default DownPage;
