import React, { useEffect, useState } from 'react';
import { fetchODs, deleteOD } from '../services/od';
import { OD, ODType, ODStatus } from '../types/od';
import { Link } from 'react-router-dom';

const ODList: React.FC = () => {
  const [ods, setOds] = useState<OD[]>([]);
  const [type, setType] = useState<ODType | ''>('');
  const [status, setStatus] = useState<ODStatus | ''>('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const loadODs = async () => {
    setLoading(true);
    const params: any = {};
    if (type) params.type = type;
    if (status) params.status = status;
    if (date) params.date = date;
    const data = await fetchODs(params);
    setOds(data);
    setLoading(false);
  };

  useEffect(() => {
    loadODs();
    // eslint-disable-next-line
  }, [type, status, date]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this OD?')) {
      await deleteOD(id);
      loadODs();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white/95 rounded-3xl shadow-2xl border border-indigo-100 p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-700 to-pink-500 bg-clip-text text-transparent tracking-tight">OD List</h1>
          <Link to="/add-od" className="inline-block bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold px-6 py-2 rounded-xl shadow hover:from-indigo-700 hover:to-pink-600 transition text-lg">+ Add OD</Link>
        </div>
        <div className="flex flex-wrap gap-4 mb-8">
          <select value={type} onChange={e => setType(e.target.value as ODType | '')} className="p-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400">
            <option value="">All Types</option>
            <option value="Placement">Placement</option>
            <option value="Self-Applied">Self-Applied</option>
          </select>
          <select value={status} onChange={e => setStatus(e.target.value as ODStatus | '')} className="p-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400">
            <option value="">All Status</option>
            <option value="Applied">Applied</option>
            <option value="In Process">In Process</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="p-2 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400" />
        </div>
        <div className="overflow-x-auto rounded-xl shadow">
          {loading ? (
            <div className="text-center py-10 text-lg text-indigo-600 font-semibold">Loading...</div>
          ) : (
            <table className="w-full table-auto border-collapse bg-white rounded-xl">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-700">
                  <th className="p-3 border-b font-semibold">Type</th>
                  <th className="p-3 border-b font-semibold">Title</th>
                  <th className="p-3 border-b font-semibold">Reason</th>
                  <th className="p-3 border-b font-semibold">Date</th>
                  <th className="p-3 border-b font-semibold">Status</th>
                  <th className="p-3 border-b font-semibold">Attachment</th>
                  <th className="p-3 border-b font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ods.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400 text-lg">No ODs found.</td>
                  </tr>
                ) : (
                  ods.map(od => (
                    <tr key={od._id} className="hover:bg-indigo-50 transition">
                      <td className="p-3 border-b text-center font-medium">{od.type}</td>
                      <td className="p-3 border-b">{od.title}</td>
                      <td className="p-3 border-b">{od.reason}</td>
                      <td className="p-3 border-b text-center">{od.date?.slice(0, 10)}</td>
                      <td className="p-3 border-b text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-md
                          ${od.status === 'Approved' ? 'bg-green-100 text-green-700' :
                            od.status === 'In Process' ? 'bg-yellow-100 text-yellow-700' :
                            od.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'}`}>{od.status}</span>
                      </td>
                      <td className="p-3 border-b text-center">
                        {od.attachment ? (
                          <a href={od.attachment} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-semibold">View</a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-3 border-b text-center">
                        <button onClick={() => handleDelete(od._id)} className="text-red-500 font-bold hover:underline hover:text-red-700 transition">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ODList;
