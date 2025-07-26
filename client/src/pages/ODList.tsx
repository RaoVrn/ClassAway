import React, { useEffect, useState } from 'react';
import { fetchODs, deleteOD } from '../services/od';
import { OD, ODType, ODStatus } from '../types/od';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6">
      <div className="max-w-4xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">OD List</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <select value={type} onChange={e => setType(e.target.value as ODType | '')} className="p-2 rounded border">
            <option value="">All Types</option>
            <option value="Placement">Placement</option>
            <option value="Self-Applied">Self-Applied</option>
          </select>
          <select value={status} onChange={e => setStatus(e.target.value as ODStatus | '')} className="p-2 rounded border">
            <option value="">All Status</option>
            <option value="Applied">Applied</option>
            <option value="In Process">In Process</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="p-2 rounded border" />
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-100 to-purple-100">
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Reason</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Attachment</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ods.map(od => (
                <tr key={od._id} className="hover:bg-blue-50">
                  <td className="p-2 border">{od.type}</td>
                  <td className="p-2 border">{od.title}</td>
                  <td className="p-2 border">{od.reason}</td>
                  <td className="p-2 border">{od.date?.slice(0, 10)}</td>
                  <td className="p-2 border">{od.status}</td>
                  <td className="p-2 border">
                    {od.attachment ? (
                      <a href={od.attachment} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="p-2 border">
                    <button onClick={() => handleDelete(od._id)} className="text-red-500 hover:underline">Delete</button>
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

export default ODList;
