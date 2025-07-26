import React, { useEffect, useState } from 'react';
import { fetchODs } from '../services/od';
import { fetchPlacements } from '../services/placement';
import { OD } from '../types/od';
import { Placement } from '../types/placement';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#f472b6', '#facc15', '#34d399'];

const Dashboard: React.FC = () => {
  const [ods, setOds] = useState<OD[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [odsData, placementsData] = await Promise.all([
        fetchODs(),
        fetchPlacements(),
      ]);
      setOds(odsData);
      setPlacements(placementsData);
      setLoading(false);
    };
    load();
  }, []);

  const odStats = {
    total: ods.length,
    placement: ods.filter(o => o.type === 'Placement').length,
    self: ods.filter(o => o.type === 'Self-Applied').length,
    approved: ods.filter(o => o.status === 'Approved').length,
    inProcess: ods.filter(o => o.status === 'In Process').length,
    rejected: ods.filter(o => o.status === 'Rejected').length,
  };

  const odPieData = [
    { name: 'Placement', value: odStats.placement },
    { name: 'Self-Applied', value: odStats.self },
  ];
  const odStatusData = [
    { name: 'Approved', value: odStats.approved },
    { name: 'In Process', value: odStats.inProcess },
    { name: 'Rejected', value: odStats.rejected },
  ];
  const placementBarData = placements.map(p => ({
    company: p.company,
    status: p.status,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6">
      <div className="max-w-5xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-6 shadow flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-2">
                OD Type Distribution
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={odPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {odPieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4">
                <ul className="text-gray-700 space-y-1">
                  <li>
                    Total ODs: <b>{odStats.total}</b>
                  </li>
                  <li>
                    Placement ODs: <b>{odStats.placement}</b>
                  </li>
                  <li>
                    Self-Applied ODs: <b>{odStats.self}</b>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-blue-100 rounded-xl p-6 shadow flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-2">OD Status</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={odStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {odStatusData.map((entry, idx) => (
                      <Cell
                        key={`cell-status-${idx}`}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4">
                <ul className="text-gray-700 space-y-1">
                  <li>
                    Approved: <b>{odStats.approved}</b>
                  </li>
                  <li>
                    In Process: <b>{odStats.inProcess}</b>
                  </li>
                  <li>
                    Rejected: <b>{odStats.rejected}</b>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-100 to-pink-100 rounded-xl p-6 shadow col-span-1 md:col-span-2 flex flex-col items-center mt-8">
              <h2 className="text-xl font-semibold mb-2">Placement Progress</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={placementBarData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="company" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="status" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4">
                <ul className="text-gray-700 space-y-1">
                  <li>
                    Total Companies: <b>{placements.length}</b>
                  </li>
                  <li>
                    Offers:{' '}
                    <b>{placements.filter(p => p.status === 'Offer').length}</b>
                  </li>
                  <li>
                    Interviews:{' '}
                    <b>{placements.filter(p => p.status === 'Interview').length}</b>
                  </li>
                  <li>
                    Tests: <b>{placements.filter(p => p.status === 'Test').length}</b>
                  </li>
                  <li>
                    Shortlisted:{' '}
                    <b>
                      {placements.filter(p => p.status === 'Shortlisted').length}
                    </b>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow col-span-1 md:col-span-2 mt-8">
              <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
              <ul className="text-gray-700 space-y-1">
                {ods.slice(0, 5).map(od => (
                  <li key={od._id}>
                    <span className="font-semibold">OD:</span> {od.title} ({od.type})
                    {' - '}
                    {od.status} on {od.date?.slice(0, 10)}
                  </li>
                ))}
                {placements.slice(0, 5).map(p => (
                  <li key={p._id}>
                    <span className="font-semibold">Placement:</span> {p.company} -{' '}
                    {p.status}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
