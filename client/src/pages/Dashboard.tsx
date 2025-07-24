import React from 'react';

const Dashboard = () => {
  // Simulated real data (replace with API calls later)
  const user = {
    name: 'Varun Prakash',
    rollNo: 'CS2022105012',
    branch: 'CSE',
    year: 'Pre-Final Year',
    email: 'prakash.varun.0305@gmail.com',
  };

  const odStats = {
    selfApplied: 12,
    placementODs: 23,
    totalODs: 35,
  };

  const upcomingEvents = [
    { title: 'Wipro Online Test', date: '27 July 2025', type: 'Placement' },
    { title: 'Google Cloud Workshop', date: '29 July 2025', type: 'Self' },
  ];

  const placementProgress = [
    { stage: 'Applied', count: 14 },
    { stage: 'Shortlisted', count: 6 },
    { stage: 'PPT Attended', count: 5 },
    { stage: 'Tests Cleared', count: 3 },
    { stage: 'Interviews', count: 2 },
    { stage: 'Offers Received', count: 1 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Dashboard</h1>

      {/* Profile Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">👤 Student Profile</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-600">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Roll No:</strong> {user.rollNo}</p>
          <p><strong>Branch:</strong> {user.branch}</p>
          <p><strong>Year:</strong> {user.year}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>

      {/* OD Stats Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">📊 OD Stats</h2>
        <div className="flex flex-wrap gap-6">
          <div className="bg-blue-100 text-blue-800 px-6 py-4 rounded-xl shadow w-48">
            <p className="text-lg font-bold">{odStats.selfApplied}</p>
            <p className="text-sm">Self-Applied ODs</p>
          </div>
          <div className="bg-green-100 text-green-800 px-6 py-4 rounded-xl shadow w-48">
            <p className="text-lg font-bold">{odStats.placementODs}</p>
            <p className="text-sm">Placement ODs</p>
          </div>
          <div className="bg-purple-100 text-purple-800 px-6 py-4 rounded-xl shadow w-48">
            <p className="text-lg font-bold">{odStats.totalODs}</p>
            <p className="text-sm">Total ODs</p>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">📅 Upcoming Events</h2>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          {upcomingEvents.map((event, idx) => (
            <li key={idx}>
              <strong>{event.title}</strong> – {event.date} ({event.type})
            </li>
          ))}
        </ul>
      </div>

      {/* Placement Progress Section */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">🚀 Placement Progress</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
          {placementProgress.map((item, idx) => (
            <div
              key={idx}
              className="bg-indigo-100 text-indigo-800 px-4 py-3 rounded-xl shadow"
            >
              <p className="text-lg font-bold">{item.count}</p>
              <p className="text-sm">{item.stage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">⚡ Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Apply Self OD
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
            View Placement Tracker
          </button>
          <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
