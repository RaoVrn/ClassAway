import React, { useEffect, useState } from 'react';
import { fetchPlacements, upsertPlacement } from '../services/placement';
import { Placement, PlacementStatus } from '../types/placement';

const statusOrder: PlacementStatus[] = [
  'Application Sent',
  'Shortlisted',
  'Pre-Placement Talk',
  'Test',
  'Interview',
  'Offer',
];

const PlacementTracker: React.FC = () => {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<PlacementStatus>('Application Sent');
  const [loading, setLoading] = useState(false);

  const loadPlacements = async () => {
    setLoading(true);
    const data = await fetchPlacements();
    setPlacements(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPlacements();
  }, []);

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await upsertPlacement(company, status);
    setCompany('');
    setStatus('Application Sent');
    loadPlacements();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6">
      <div className="max-w-4xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Placement Tracker</h1>
        <form onSubmit={handleAddOrUpdate} className="flex flex-wrap gap-4 mb-6 items-end">
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={e => setCompany(e.target.value)}
            className="p-2 rounded border"
            required
          />
          <select value={status} onChange={e => setStatus(e.target.value as PlacementStatus)} className="p-2 rounded border">
            {statusOrder.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Save</button>
        </form>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-purple-100">
                <th className="p-2 border">Company</th>
                <th className="p-2 border">Status Timeline</th>
              </tr>
            </thead>
            <tbody>
              {placements.map(p => (
                <tr key={p._id} className="hover:bg-blue-50">
                  <td className="p-2 border font-semibold">{p.company}</td>
                  <td className="p-2 border">
                    <div className="flex gap-2 flex-wrap">
                      {statusOrder.map(s => (
                        <span
                          key={s}
                          className={`px-2 py-1 rounded text-xs font-medium ${statusOrder.indexOf(s) <= statusOrder.indexOf(p.status) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PlacementTracker;
