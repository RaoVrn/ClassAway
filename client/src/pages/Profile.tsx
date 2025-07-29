import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/user';
import { fetchODs } from '../services/od';
import { fetchPlacements } from '../services/placement';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [personalEditMode, setPersonalEditMode] = useState<boolean>(false);
  const [detailsEditMode, setDetailsEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ods, setOds] = useState<any[]>([]);
  const [placements, setPlacements] = useState<any[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setLoading(false);
      try {
        const [profile, odsData, placementsData] = await Promise.all([
          getProfile(token),
          fetchODs(),
          fetchPlacements(),
        ]);
        setUser(profile);
        setForm(profile);
        setOds(odsData);
        setPlacements(placementsData);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleNestedChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };
  const handleSavePersonal = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');
      const updated = await updateProfile(form, token);
      setUser(updated);
      setForm(updated);
      setPersonalEditMode(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleSaveDetails = async () => {
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token');
      const updated = await updateProfile(form, token);
      setUser(updated);
      setForm(updated);
      setDetailsEditMode(false);
    } catch (err) {
      setError('Failed to update profile');
    }
  };


  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  if (!user) return null;

  // Real stats from ODs and placements
  const odApplied = ods.length;
  const odApproved = ods.filter((o) => o.status === 'Approved').length;
  const odRejected = ods.filter((o) => o.status === 'Rejected').length;
  const placementsCount = placements.length;
  const stats = [
    { label: 'ODs Applied', value: odApplied },
    { label: 'Placements', value: placementsCount },
    { label: 'ODs Approved', value: odApproved },
    { label: 'ODs Rejected', value: odRejected },
  ];
  const chartData = {
    labels: stats.map(s => s.label),
    datasets: [
      {
        label: 'Count',
        data: stats.map(s => s.value),
        backgroundColor: [
          '#6366f1',
          '#ec4899',
          '#10b981',
          '#f59e42',
        ],
        borderRadius: 8,
      },
    ],
  };

  // Pie chart for OD status
  const odPieData = {
    labels: ['Approved', 'Rejected', 'Pending'],
    datasets: [
      {
        data: [
          odApproved,
          odRejected,
          odApplied - odApproved - odRejected,
        ],
        backgroundColor: [
          '#10b981', // green
          '#ef4444', // red
          '#f59e42', // orange
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
        {/* Container 1: Personal Info */}
        {/* Container 1: Personal Info */}
        <div className="bg-white/95 rounded-3xl shadow-2xl border border-indigo-100 p-10 flex flex-col md:flex-row gap-8 items-center md:items-start relative">
          <button
            onClick={() => setPersonalEditMode(true)}
            className="absolute top-6 right-6 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold px-5 py-2 rounded-xl shadow hover:from-indigo-600 hover:to-pink-600 transition text-sm z-10"
          >
            Edit
          </button>
          {/* Avatar column */}
          <div className="flex flex-col items-center md:items-start flex-1 justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-200 to-pink-200 flex items-center justify-center overflow-hidden mb-4 border-4 border-indigo-300 shadow-lg">
              {user.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <svg className="w-20 h-20 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
                </svg>
              )}
            </div>
          </div>
          {/* Details + Welcome card column */}
          <div className="flex flex-col md:flex-row flex-[3] gap-8 w-full">
            {/* Details section */}
            <div className="flex flex-col gap-2 flex-1 justify-center">
              {personalEditMode ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={form.name || ''}
                    onChange={handleChange}
                    className="text-4xl font-extrabold text-indigo-700 tracking-tight border-b-2 border-indigo-200 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email || ''}
                    onChange={handleChange}
                    className="text-lg text-gray-500 font-mono border-b-2 border-indigo-200 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex flex-wrap gap-2 my-2">
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 text-white px-4 py-1 rounded-full font-bold text-xs shadow">Active</span>
                    <span className="bg-gradient-to-r from-yellow-400 to-pink-300 text-white px-4 py-1 rounded-full font-bold text-xs shadow">Student</span>
                  </div>
                  <div className="flex flex-wrap gap-6 text-base text-gray-700 mt-2">
                    <span>
                      <span className="font-semibold text-indigo-700">Phone:</span>{' '}
                      <input
                        type="text"
                        name="phone"
                        value={form.phone || ''}
                        onChange={handleChange}
                        className="border-b-2 border-indigo-200 focus:outline-none focus:border-indigo-500"
                        placeholder="Not added"
                      />
                    </span>
                    <span>
                      <span className="font-semibold text-indigo-700">Branch:</span>{' '}
                      <input
                        type="text"
                        name="branch"
                        value={form.branch || ''}
                        onChange={handleChange}
                        className="border-b-2 border-indigo-200 focus:outline-none focus:border-indigo-500"
                      />
                    </span>
                    <span>
                      <span className="font-semibold text-indigo-700">Year:</span>{' '}
                      <input
                        type="text"
                        name="year"
                        value={form.year || ''}
                        onChange={handleChange}
                        className="border-b-2 border-indigo-200 focus:outline-none focus:border-indigo-500"
                      />
                    </span>
                    <span>
                      <span className="font-semibold text-indigo-700">Roll No:</span>{' '}
                      <input
                        type="text"
                        name="roll"
                        value={form.roll || ''}
                        onChange={handleChange}
                        className="border-b-2 border-indigo-200 focus:outline-none focus:border-indigo-500"
                        placeholder="Not added"
                      />
                    </span>
                  </div>
                  <div className="mt-4">
                    <label className="block font-semibold text-indigo-700 mb-1">About</label>
                    <textarea
                      name="bio"
                      value={form.bio || ''}
                      onChange={handleChange}
                      className="w-full border-b-2 border-indigo-200 focus:outline-none focus:border-indigo-500 resize-y"
                      rows={3}
                      placeholder="No bio added."
                    ></textarea>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={handleSavePersonal}
                      className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold px-6 py-2 rounded-xl shadow hover:from-indigo-700 hover:to-pink-600 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setPersonalEditMode(false); setForm(user); }}
                      className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 font-bold px-6 py-2 rounded-xl shadow hover:from-gray-400 hover:to-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-4xl font-extrabold text-indigo-700 tracking-tight">{user.name}</div>
                  <div className="text-lg text-gray-500 font-mono">{user.email}</div>
                  <div className="flex flex-wrap gap-2 my-2">
                    <span className="bg-gradient-to-r from-indigo-400 to-pink-400 text-white px-4 py-1 rounded-full font-bold text-xs shadow">Active</span>
                    <span className="bg-gradient-to-r from-yellow-400 to-pink-300 text-white px-4 py-1 rounded-full font-bold text-xs shadow">Student</span>
                  </div>
                  <div className="flex flex-wrap gap-6 text-base text-gray-700 mt-2">
                    <span><span className="font-semibold text-indigo-700">Phone:</span> {user.phone || <span className="text-gray-400">Not added</span>}</span>
                    <span><span className="font-semibold text-indigo-700">Branch:</span> {user.branch}</span>
                    <span><span className="font-semibold text-indigo-700">Year:</span> {user.year}</span>
                    <span><span className="font-semibold text-indigo-700">Roll No:</span> {user.roll || <span className="text-gray-400">Not added</span>}</span>
                  </div>
                  <div className="mt-4">
                    <label className="block font-semibold text-indigo-700 mb-1">About</label>
                    <div className="text-gray-700 text-base">{user.bio || <span className="text-gray-400">No bio added.</span>}</div>
                  </div>
                </>
              )}
            </div>
            {/* Welcome card section - improved styling */}
            <div className="flex-1 flex flex-col items-center md:items-end w-full md:mt-0 mt-4">
              <div className="bg-gradient-to-br from-white via-indigo-50 to-pink-100 rounded-2xl shadow-xl p-8 max-w-xs w-full border border-indigo-100 flex flex-col items-start gap-2">
                <h2 className="text-2xl font-bold text-indigo-700 mb-1">Welcome back, {user.name?.split(' ')[0] || 'User'}! <span className='ml-1'></span></h2>
                <p className="text-gray-700 text-base mb-1 leading-relaxed">Here's a quick snapshot of your journey so far. Keep pushing forward and make the most of every opportunity!</p>
                <p className="text-indigo-500 font-semibold italic border-l-4 border-indigo-300 pl-3 mt-2">"Success is the sum of small efforts, repeated day in and day out."</p>
              </div>
            </div>
          </div>
        </div>

        {/* Container 2: Profile Details (Edit) - Only Edit button, no empty sections */}
        <div className="bg-white/95 rounded-3xl shadow-2xl border border-indigo-100 p-10 flex flex-col gap-6 relative min-h-[100px]">
          <button
            onClick={() => setDetailsEditMode(!detailsEditMode)}
            className="absolute top-6 right-6 bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold px-5 py-2 rounded-xl shadow hover:from-indigo-600 hover:to-pink-600 transition text-sm z-10"
          >
            {detailsEditMode ? 'Close' : 'Edit'}
          </button>
          <div className="flex flex-col gap-4 mt-2">
            {/* Skills */}
            <div>
              <span className="font-semibold text-indigo-700 text-lg">Skills</span>
              {detailsEditMode ? (
                <div className="flex flex-col gap-2 mt-1">
                  {(form.skills && form.skills.length > 0 ? form.skills : []).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={e => {
                          const updated = [...(form.skills || [])];
                          updated[idx] = e.target.value;
                          handleNestedChange('skills', updated);
                        }}
                        className="border border-indigo-200 rounded px-3 py-1 flex-1 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        placeholder="Add a skill"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(form.skills || [])];
                          updated.splice(idx, 1);
                          handleNestedChange('skills', updated);
                        }}
                        className="text-red-500 hover:text-red-700 font-bold px-2"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleNestedChange('skills', [...(form.skills || []), ''])}
                    className="mt-1 text-indigo-600 hover:text-indigo-900 font-semibold text-sm self-start"
                  >
                    + Add Skill
                  </button>
                  {(!form.skills || form.skills.length === 0) && (
                    <div className="text-gray-400 text-sm mt-1">No skills added.</div>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.skills && user.skills.length > 0 ? user.skills.map((item: string, idx: number) => (
                    <span key={idx} className="bg-gradient-to-r from-indigo-100 to-pink-100 text-indigo-700 px-3 py-1 rounded-lg font-semibold text-sm shadow">
                      {item}
                    </span>
                  )) : (
                    <span className="text-gray-400 text-sm">No skills added.</span>
                  )}
                </div>
              )}
            </div>
            {/* Interests */}
            <div>
              <span className="font-semibold text-indigo-700 text-lg">Interests</span>
              {detailsEditMode ? (
                <div className="flex flex-col gap-2 mt-1">
                  {(form.interests && form.interests.length > 0 ? form.interests : []).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={e => {
                          const updated = [...(form.interests || [])];
                          updated[idx] = e.target.value;
                          handleNestedChange('interests', updated);
                        }}
                        className="border border-pink-200 rounded px-3 py-1 flex-1 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        placeholder="Add an interest"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(form.interests || [])];
                          updated.splice(idx, 1);
                          handleNestedChange('interests', updated);
                        }}
                        className="text-red-500 hover:text-red-700 font-bold px-2"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleNestedChange('interests', [...(form.interests || []), ''])}
                    className="mt-1 text-pink-600 hover:text-pink-900 font-semibold text-sm self-start"
                  >
                    + Add Interest
                  </button>
                  {(!form.interests || form.interests.length === 0) && (
                    <div className="text-gray-400 text-sm mt-1">No interests added.</div>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.interests && user.interests.length > 0 ? user.interests.map((item: string, idx: number) => (
                    <span key={idx} className="bg-gradient-to-r from-pink-100 to-yellow-100 text-pink-700 px-3 py-1 rounded-lg font-semibold text-sm shadow">
                      {item}
                    </span>
                  )) : (
                    <span className="text-gray-400 text-sm">No interests added.</span>
                  )}
                </div>
              )}
            </div>
            {/* Education */}
            <div>
              <span className="font-semibold text-indigo-700 text-lg">Education</span>
              {detailsEditMode ? (
                <div className="flex flex-col gap-2 mt-1">
                  {(form.education && form.education.length > 0 ? form.education : []).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={e => {
                          const updated = [...(form.education || [])];
                          updated[idx] = e.target.value;
                          handleNestedChange('education', updated);
                        }}
                        className="border border-blue-200 rounded px-3 py-1 flex-1 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="Add education"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(form.education || [])];
                          updated.splice(idx, 1);
                          handleNestedChange('education', updated);
                        }}
                        className="text-red-500 hover:text-red-700 font-bold px-2"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleNestedChange('education', [...(form.education || []), ''])}
                    className="mt-1 text-blue-600 hover:text-blue-900 font-semibold text-sm self-start"
                  >
                    + Add Education
                  </button>
                  {(!form.education || form.education.length === 0) && (
                    <div className="text-gray-400 text-sm mt-1">No education added.</div>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.education && user.education.length > 0 ? user.education.map((item: string, idx: number) => (
                    <span key={idx} className="bg-gradient-to-r from-indigo-100 to-blue-100 text-blue-700 px-3 py-1 rounded-lg font-semibold text-sm shadow">
                      {item}
                    </span>
                  )) : (
                    <span className="text-gray-400 text-sm">No education added.</span>
                  )}
                </div>
              )}
            </div>
            {/* Achievements */}
            <div>
              <span className="font-semibold text-indigo-700 text-lg">Achievements</span>
              {detailsEditMode ? (
                <div className="flex flex-col gap-2 mt-1">
                  {(form.achievements && form.achievements.length > 0 ? form.achievements : []).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={e => {
                          const updated = [...(form.achievements || [])];
                          updated[idx] = e.target.value;
                          handleNestedChange('achievements', updated);
                        }}
                        className="border border-pink-200 rounded px-3 py-1 flex-1 bg-white/80 focus:outline-none focus:ring-2 focus:ring-pink-300"
                        placeholder="Add an achievement"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(form.achievements || [])];
                          updated.splice(idx, 1);
                          handleNestedChange('achievements', updated);
                        }}
                        className="text-red-500 hover:text-red-700 font-bold px-2"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleNestedChange('achievements', [...(form.achievements || []), ''])}
                    className="mt-1 text-pink-600 hover:text-pink-900 font-semibold text-sm self-start"
                  >
                    + Add Achievement
                  </button>
                  {(!form.achievements || form.achievements.length === 0) && (
                    <div className="text-gray-400 text-sm mt-1">No achievements added.</div>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.achievements && user.achievements.length > 0 ? user.achievements.map((item: string, idx: number) => (
                    <span key={idx} className="bg-gradient-to-r from-pink-100 to-indigo-100 text-pink-700 px-3 py-1 rounded-lg font-semibold text-sm shadow">
                      {item}
                    </span>
                  )) : (
                    <span className="text-gray-400 text-sm">No achievements added.</span>
                  )}
                </div>
              )}
            </div>
            {/* Projects */}
            <div>
              <span className="font-semibold text-indigo-700 text-lg">Projects</span>
              {detailsEditMode ? (
                <div className="flex flex-col gap-2 mt-1">
                  {(form.projects && form.projects.length > 0 ? form.projects : []).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={e => {
                          const updated = [...(form.projects || [])];
                          updated[idx] = e.target.value;
                          handleNestedChange('projects', updated);
                        }}
                        className="border border-green-200 rounded px-3 py-1 flex-1 bg-white/80 focus:outline-none focus:ring-2 focus:ring-green-300"
                        placeholder="Add a project"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(form.projects || [])];
                          updated.splice(idx, 1);
                          handleNestedChange('projects', updated);
                        }}
                        className="text-red-500 hover:text-red-700 font-bold px-2"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleNestedChange('projects', [...(form.projects || []), ''])}
                    className="mt-1 text-green-600 hover:text-green-900 font-semibold text-sm self-start"
                  >
                    + Add Project
                  </button>
                  {(!form.projects || form.projects.length === 0) && (
                    <div className="text-gray-400 text-sm mt-1">No projects added.</div>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.projects && user.projects.length > 0 ? user.projects.map((item: string, idx: number) => (
                    <span key={idx} className="bg-gradient-to-r from-green-100 to-indigo-100 text-green-700 px-3 py-1 rounded-lg font-semibold text-sm shadow">
                      {item}
                    </span>
                  )) : (
                    <span className="text-gray-400 text-sm">No projects added.</span>
                  )}
                </div>
              )}
            </div>
            {/* Certifications */}
            <div>
              <span className="font-semibold text-indigo-700 text-lg">Certifications</span>
              {detailsEditMode ? (
                <div className="flex flex-col gap-2 mt-1">
                  {(form.certifications && form.certifications.length > 0 ? form.certifications : []).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={e => {
                          const updated = [...(form.certifications || [])];
                          updated[idx] = e.target.value;
                          handleNestedChange('certifications', updated);
                        }}
                        className="border border-indigo-200 rounded px-3 py-1 flex-1 bg-white/80 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        placeholder="Add a certification"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(form.certifications || [])];
                          updated.splice(idx, 1);
                          handleNestedChange('certifications', updated);
                        }}
                        className="text-red-500 hover:text-red-700 font-bold px-2"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleNestedChange('certifications', [...(form.certifications || []), ''])}
                    className="mt-1 text-indigo-600 hover:text-indigo-900 font-semibold text-sm self-start"
                  >
                    + Add Certification
                  </button>
                  {(!form.certifications || form.certifications.length === 0) && (
                    <div className="text-gray-400 text-sm mt-1">No certifications added.</div>
                  )}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.certifications && user.certifications.length > 0 ? user.certifications.map((item: string, idx: number) => (
                    <span key={idx} className="bg-gradient-to-r from-indigo-100 to-green-100 text-indigo-700 px-3 py-1 rounded-lg font-semibold text-sm shadow">
                      {item}
                    </span>
                  )) : (
                    <span className="text-gray-400 text-sm">No certifications added.</span>
                  )}
                </div>
              )}
            </div>
            {/* Save/Cancel buttons */}
            {detailsEditMode && (
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleSaveDetails}
                  className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold px-6 py-2 rounded-xl shadow hover:from-indigo-700 hover:to-pink-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => { setDetailsEditMode(false); setForm(user); }}
                  className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 font-bold px-6 py-2 rounded-xl shadow hover:from-gray-400 hover:to-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Container 3: Stats & Charts */}
        <div className="bg-white/95 rounded-3xl shadow-2xl border border-indigo-100 p-10 flex flex-col gap-8">
          <h3 className="text-2xl font-bold text-indigo-700 mb-4">Your Stats</h3>
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="flex-1 flex flex-wrap gap-6 mb-6 md:mb-0">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl shadow-lg px-8 py-4 flex flex-col items-center border-2 border-indigo-100 bg-gradient-to-br ${i % 2 === 0 ? 'from-indigo-100 to-pink-100' : 'from-pink-100 to-indigo-100'} min-w-[140px]`}
                >
                  <span className="text-lg font-semibold text-indigo-700">{stat.label}</span>
                  <span className="text-3xl font-extrabold text-indigo-900 mt-1">{stat.value}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 flex flex-col md:flex-row gap-6 w-full justify-end">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100 w-full max-w-xs flex-1">
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      title: { display: false },
                    },
                    scales: {
                      y: { beginAtZero: true, ticks: { stepSize: 1 } },
                    },
                  }}
                />
              </div>
              {/* Pie chart removed as requested */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
