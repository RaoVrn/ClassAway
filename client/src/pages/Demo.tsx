import React from 'react';

const Demo = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-4">
      <div className="bg-white/90 border border-indigo-100 rounded-2xl shadow-xl max-w-2xl w-full p-8 sm:p-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 bg-gradient-to-r from-indigo-700 via-pink-500 to-indigo-400 bg-clip-text text-transparent tracking-tight">Demo Dashboard</h1>
        <p className="text-gray-600 mb-6 text-lg">This is a demo experience. Sign up or log in to access your personalized dashboard and start tracking your ODs, placements, and attendance!</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/register" className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-all duration-200 text-base">Create Account</a>
          <a href="/login" className="bg-white border border-indigo-200 text-indigo-700 font-bold px-6 py-3 rounded-xl shadow hover:bg-indigo-50 transition-all duration-200 text-base">Login</a>
        </div>
        <div className="mt-8 text-left text-gray-700 text-sm">
          <strong>Demo Features:</strong>
          <ul className="list-disc ml-6 mt-2">
            <li>Preview dashboard layout</li>
            <li>See example OD and placement data</li>
            <li>Explore features without signing in</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Demo;
