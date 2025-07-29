import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOD } from '../services/od';

const AddOD: React.FC = () => {
  const [type, setType] = useState<'Placement' | 'Self-Applied'>('Placement');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState<'Applied' | 'In Process' | 'Approved' | 'Rejected'>('Applied');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dayOrder, setDayOrder] = useState<'1' | '2' | '3' | '4' | '5'>('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Placement ODs are always 'Applied' or 'Approved' (default to 'Applied' on add, can be updated later)
  React.useEffect(() => {
    if (type === 'Placement') setStatus('Approved');
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await addOD({
        type,
        date,
        reason,
        status,
        title,
        description,
        dayOrder,
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to add OD. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-3xl mx-auto bg-white/95 rounded-3xl shadow-2xl border border-indigo-200 p-14 flex flex-col items-center">
        <h2 className="text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-indigo-700 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-lg">Add Opportunity Discovery (OD)</h2>
        {error && <div className="mb-4 text-red-600 text-center font-semibold">{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-10 gap-y-6 w-full">
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 font-semibold text-indigo-700">OD Type</label>
            <select value={type} onChange={e => setType(e.target.value as any)} className="w-full border border-indigo-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 bg-white">
              <option value="Placement">Placement</option>
              <option value="Self-Applied">Self-Applied</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 font-semibold text-indigo-700">Day Order (DO)</label>
            <select value={dayOrder} onChange={e => setDayOrder(e.target.value as any)} className="w-full border border-indigo-200 rounded-lg p-2 focus:ring-2 focus:ring-pink-400 bg-white">
              <option value="1">DO 1</option>
              <option value="2">DO 2</option>
              <option value="3">DO 3</option>
              <option value="4">DO 4</option>
              <option value="5">DO 5</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Select the Day Order for which this OD applies.</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 font-semibold text-indigo-700">Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-indigo-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 bg-white" required />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 font-semibold text-indigo-700">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-indigo-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 bg-white" required />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 font-semibold text-indigo-700">Reason</label>
            <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="w-full border border-indigo-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 bg-white" required />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 font-semibold text-indigo-700">Status/Stage</label>
            <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full border border-indigo-200 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 bg-white" disabled={type === 'Placement'}>
              <option value="Applied">Applied</option>
              <option value="In Process">In Process</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            {type === 'Placement' && <p className="text-xs text-gray-500 mt-1">Placement ODs start as Applied and can be updated later.</p>}
          </div>
          <div className="col-span-2">
            <label className="block mb-1 font-semibold text-indigo-700">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-indigo-200 rounded-lg p-2 focus:ring-2 focus:ring-pink-400 bg-white" rows={4} />
          </div>
          <div className="col-span-2 flex justify-center mt-2">
            <button type="submit" className="w-2/3 bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-3 rounded-xl font-bold text-lg shadow-md hover:from-indigo-700 hover:to-pink-600 transition-all duration-200 scale-100 hover:scale-105" disabled={loading}>
              {loading ? 'Adding...' : 'Add OD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOD;
