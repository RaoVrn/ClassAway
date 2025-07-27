
import React, { useState, useEffect } from 'react';
import { fetchPlacements, upsertPlacement } from '../services/placement';
import type { Placement, PlacementStatus } from '../types/placement';
import { BsBriefcaseFill, BsAwardFill, BsCalendarCheck, BsBuilding } from 'react-icons/bs';
import { FaUserTie } from 'react-icons/fa';

const statusOrder: PlacementStatus[] = [
  'Application Sent',
  'Shortlisted',
  'Pre-Placement Talk',
  'Test',
  'Interview',
  'Offer',
];

const statusColors: Record<string, string> = {
  'Application Sent': 'bg-blue-100 text-blue-700',
  'Shortlisted': 'bg-cyan-100 text-cyan-700',
  'Pre-Placement Talk': 'bg-purple-100 text-purple-700',
  'Test': 'bg-yellow-100 text-yellow-700',
  'Interview': 'bg-pink-100 text-pink-700',
  'Offer': 'bg-green-100 text-green-700',
};

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);

function PlacementTracker() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<PlacementStatus>('Application Sent');
  const [loading, setLoading] = useState(false);
  const [jobRole, setJobRole] = useState('');
  const [salaryRange, setSalaryRange] = useState('Not Disclosed');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('Full Time');
  const [applicationDate, setApplicationDate] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Partial<Placement>>({});
  const [error, setError] = useState<string | null>(null);

  const loadPlacements = async () => {
    setLoading(true);
    try {
      const data = await fetchPlacements();
      setPlacements(data);
    } catch (e) {
      setError('Failed to load placements.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPlacements();
  }, []);

  const handleAddOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await upsertPlacement({
        _id: editId || undefined,
        company,
        status,
        jobRole,
        salaryRange,
        salary: salary ? Number(salary) : undefined,
        jobType,
        applicationDate,
      });
      setCompany('');
      setStatus('Application Sent');
      setJobRole('');
      setSalaryRange('Not Disclosed');
      setSalary('');
      setJobType('Full Time');
      setApplicationDate('');
      setEditId(null);
      setEditFields({});
      loadPlacements();
    } catch (e) {
      setError('Failed to save placement.');
    }
  };

  const handleEdit = (placement: Placement) => {
    setEditId(placement._id);
    setCompany(placement.company);
    setStatus(placement.status);
    setJobRole(placement.jobRole || '');
    setSalaryRange(placement.salaryRange || 'Not Disclosed');
    setSalary(placement.salary ? String(placement.salary) : '');
    setJobType(placement.jobType || 'Full Time');
    setApplicationDate(placement.applicationDate || '');
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      const { deletePlacement } = await import('../services/placement');
      await deletePlacement(id);
      loadPlacements();
    } catch (e) {
      setError('Failed to delete placement.');
    }
  };

  const getTag = (salaryRange?: string) => {
    if (!salaryRange) return null;
    if (salaryRange === 'Less than 5 LPA') return { label: 'Mass Recruiter', color: 'bg-gray-200 text-gray-700' };
    if (salaryRange === '5-10 LPA') return { label: 'Dream', color: 'bg-blue-100 text-blue-700' };
    if (salaryRange === '10-20 LPA') return { label: 'Super Dream', color: 'bg-purple-100 text-purple-700' };
    if (salaryRange === 'Above 20 LPA') return { label: 'Marquee', color: 'bg-yellow-100 text-yellow-700' };
    return null;
  };

  // Summary
  const total = placements.length;
  const offers = placements.filter((p: Placement) => p.status === 'Offer').length;
  const interviews = placements.filter((p: Placement) => p.status === 'Interview').length;
  const shortlisted = placements.filter((p: Placement) => p.status === 'Shortlisted').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white/95 rounded-3xl shadow-2xl border border-indigo-100 p-10">
        <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-indigo-700 to-pink-500 bg-clip-text text-transparent tracking-tight">Placement Tracker</h1>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center border border-indigo-100">
            <BsBriefcaseFill className="text-3xl text-indigo-500 mb-2" />
            <div className="text-lg font-semibold text-gray-700">Total Applications</div>
            <div className="text-2xl font-bold text-indigo-700">{total}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center border border-indigo-100">
            <BsAwardFill className="text-3xl text-green-500 mb-2" />
            <div className="text-lg font-semibold text-gray-700">Offers</div>
            <div className="text-2xl font-bold text-green-600">{offers}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center border border-indigo-100">
            <BsCalendarCheck className="text-3xl text-pink-500 mb-2" />
            <div className="text-lg font-semibold text-gray-700">Interviews</div>
            <div className="text-2xl font-bold text-pink-600">{interviews}</div>
          </div>
          <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center border border-indigo-100">
            <FaUserTie className="text-3xl text-cyan-500 mb-2" />
            <div className="text-lg font-semibold text-gray-700">Shortlisted</div>
            <div className="text-2xl font-bold text-cyan-600">{shortlisted}</div>
          </div>
        </div>
        {/* Add/Update Form */}
        <form onSubmit={handleAddOrUpdate} className="flex flex-wrap gap-4 mb-10 items-end justify-center bg-indigo-50 rounded-xl p-6 shadow">
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-indigo-700">Company Name</label>
            <input
              type="text"
              placeholder="Company Name"
              value={company}
              onChange={e => setCompany(e.target.value)}
              className="p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400 min-w-[140px]"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-indigo-700">Job Role</label>
            <input
              type="text"
              placeholder="Job Role"
              value={jobRole}
              onChange={e => setJobRole(e.target.value)}
              className="p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400 min-w-[120px]"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-indigo-700">Salary Range</label>
            <select
              value={salaryRange}
              onChange={e => setSalaryRange(e.target.value)}
              className="p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400 min-w-[120px]"
            >
              <option value="Not Disclosed">Not Disclosed</option>
              <option value="Less than 5 LPA">Less than 5 LPA</option>
              <option value="5-10 LPA">5-10 LPA</option>
              <option value="10-20 LPA">10-20 LPA</option>
              <option value="Above 20 LPA">Above 20 LPA</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-indigo-700">Salary (LPA)</label>
            <input
              type="number"
              placeholder="Salary (LPA)"
              value={salary}
              onChange={e => setSalary(e.target.value)}
              className="p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400 min-w-[100px]"
              min="0"
              step="0.1"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-indigo-700">Job Type</label>
            <select
              value={jobType}
              onChange={e => setJobType(e.target.value)}
              className="p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400 min-w-[120px]"
            >
              <option value="Full Time">Full Time</option>
              <option value="Intern">Intern</option>
              <option value="Intern leads to Full Time">Intern leads to Full Time</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-indigo-700">Application Date</label>
            <input
              type="date"
              placeholder="Application Date"
              value={applicationDate}
              onChange={e => setApplicationDate(e.target.value)}
              className="p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400 min-w-[140px]"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-indigo-700">Status/Stage</label>
            <select value={status} onChange={e => setStatus(e.target.value as PlacementStatus)} className="p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-400">
              {statusOrder.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold px-6 py-3 rounded-xl shadow hover:from-indigo-700 hover:to-pink-600 transition text-lg h-[48px] mt-6">
            {editId ? 'Update' : 'Save'}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setCompany(''); setStatus('Application Sent'); setJobRole(''); setSalaryRange('Not Disclosed'); setSalary(''); setJobType('Full Time'); setApplicationDate(''); }} className="bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl shadow hover:bg-gray-300 transition text-lg h-[48px] mt-6">Cancel</button>
          )}
        </form>
        {error && <div className="text-center text-red-600 font-semibold mb-4">{error}</div>}
        {/* Placement Table */}
        <div className="overflow-x-auto rounded-xl shadow">
          {loading ? (
            <div className="text-center py-10 text-lg text-indigo-600 font-semibold">Loading...</div>
          ) : (
            <table className="w-full table-auto border-collapse bg-white rounded-xl">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-700">
                  <th className="p-3 border-b font-semibold">Company</th>
                  <th className="p-3 border-b font-semibold">Job Role</th>
                  <th className="p-3 border-b font-semibold">Salary (LPA)</th>
                  <th className="p-3 border-b font-semibold">Type</th>
                  <th className="p-3 border-b font-semibold">Applied On</th>
                  <th className="p-3 border-b font-semibold">Timeline</th>
                  <th className="p-3 border-b font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {placements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400 text-lg">No placements found.</td>
                  </tr>
                ) : (
                  placements.map((p: Placement) => {
                    const tag = getTag(p.salaryRange);
                    return (
                      <tr key={p._id} className="hover:bg-indigo-50 transition">
                        <td className="p-3 border-b flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold border-2 border-indigo-200 shadow">
                            {getInitials(p.company)}
                          </div>
                          <div>
                            <div className="font-bold text-lg text-indigo-700">{p.company}</div>
                            {tag && <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-bold ${tag.color}`}>{tag.label}</span>}
                          </div>
                        </td>
                        <td className="p-3 border-b text-center">{p.jobRole || <span className="text-gray-400">—</span>}</td>
                        <td className="p-3 border-b text-center">{p.salaryRange || <span className="text-gray-400">—</span>}</td>
                        <td className="p-3 border-b text-center">{typeof p.salary === 'number' ? `${p.salary} LPA` : <span className="text-gray-400">—</span>}</td>
                        <td className="p-3 border-b text-center">{p.jobType || <span className="text-gray-400">—</span>}</td>
                        <td className="p-3 border-b text-center">{p.applicationDate ? new Date(p.applicationDate).toLocaleDateString() : <span className="text-gray-400">—</span>}</td>
                        <td className="p-3 border-b">
                          <div className="flex gap-2 flex-wrap">
                            {statusOrder.map(s => (
                              <span
                                key={s}
                                className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${statusColors[s]} ${statusOrder.indexOf(s) <= statusOrder.indexOf(p.status) ? '' : 'opacity-50'}`}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 border-b text-center">
                          <button onClick={() => handleEdit(p)} className="text-indigo-600 font-bold hover:underline mr-2">Edit</button>
                          <button onClick={() => handleDelete(p._id)} className="text-red-500 font-bold hover:underline">Delete</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlacementTracker;
