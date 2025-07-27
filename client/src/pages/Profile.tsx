import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/user';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({});
  const [editField, setEditField] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setLoading(false);
      try {
        const data = await getProfile(token);
        setUser(data);
        setForm(data);
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const updated = await updateProfile(form, token);
      setUser(updated);
      setForm(updated);
      setSuccess('Profile updated!');
      setEditMode(false);
      setEditField(null);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setForm(user);
    setEditMode(false);
    setEditField(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Generic handler for nested fields (e.g., socials, education, etc.)
  const handleNestedChange = (field: string, value: any) => {
    setForm({ ...form, ...{ [field]: value } });
  };

  const handleDeleteAccount = () => setShowDelete(true);
  // ...existing code...
  const confirmDelete = () => {
    setShowDelete(false);
    alert('Account deletion is not implemented in this demo.');
  };


  // Resume upload handler (for demo, just store file name in form.resume)
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, resume: e.target.files[0].name });
    }
  };

  // Skills handlers
  const [newSkill, setNewSkill] = useState('');
  const handleAddSkill = () => {
    if (newSkill && (!form.skills || !form.skills.includes(newSkill))) {
      setForm({ ...form, skills: [...(form.skills || []), newSkill] });
    }
    setNewSkill('');
  };
  const handleRemoveSkill = (skill: string) => {
    setForm({ ...form, skills: (form.skills || []).filter((s: string) => s !== skill) });
  };

  // Interests handlers
  const [newInterest, setNewInterest] = useState('');
  const handleAddInterest = () => {
    if (newInterest && (!form.interests || !form.interests.includes(newInterest))) {
      setForm({ ...form, interests: [...(form.interests || []), newInterest] });
    }
    setNewInterest('');
  };
  const handleRemoveInterest = (interest: string) => {
    setForm({ ...form, interests: (form.interests || []).filter((i: string) => i !== interest) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-white via-indigo-50 to-pink-50 rounded-3xl shadow-2xl border border-indigo-100 p-0 flex flex-col md:flex-row gap-0 overflow-hidden min-h-[700px]">
        {/* Left: Avatar & Info */}
        <div className="flex flex-col items-center md:w-1/3 w-full bg-gradient-to-b from-indigo-100 to-pink-100 p-10 min-h-full">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-200 to-pink-200 flex items-center justify-center overflow-hidden mb-4 border-4 border-indigo-300 shadow-lg">
            {form.avatar ? (
              <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-28 h-28 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
              </svg>
            )}
          </div>
          <div className="text-2xl font-extrabold text-indigo-700 mb-1 mt-2 tracking-tight">
            {editMode ? (
              <input name="name" value={form.name || ''} onChange={handleChange} className="font-extrabold text-indigo-700 bg-white border-b-2 border-indigo-300 focus:outline-none" />
            ) : form.name}
          </div>
          <div className="text-lg text-gray-500 mb-2 font-mono">{form.email}</div>
          <div className="flex flex-col gap-1 w-full">
            <div className="text-base text-gray-700"><span className="font-semibold text-indigo-700">Phone:</span> {editMode ? <input name="phone" value={form.phone || ''} onChange={handleChange} className="bg-white border-b border-indigo-200 focus:outline-none" /> : form.phone}</div>
            <div className="text-base text-gray-700"><span className="font-semibold text-indigo-700">Branch:</span> {editMode ? <input name="branch" value={form.branch || ''} onChange={handleChange} className="bg-white border-b border-indigo-200 focus:outline-none" /> : form.branch}</div>
            <div className="text-base text-gray-700"><span className="font-semibold text-indigo-700">Year:</span> {editMode ? <input name="year" value={form.year || ''} onChange={handleChange} className="bg-white border-b border-indigo-200 focus:outline-none" /> : form.year}</div>
            <div className="text-base text-gray-700"><span className="font-semibold text-indigo-700">Roll No:</span> {editMode ? <input name="roll" value={form.roll || ''} onChange={handleChange} className="bg-white border-b border-indigo-200 focus:outline-none" /> : form.roll}</div>
          </div>
          <div className="flex gap-2 mt-4">
            {editMode ? (
              <>
                <button onClick={handleSave} className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold px-6 py-2 rounded-xl shadow hover:from-indigo-700 hover:to-pink-600 transition">Save</button>
                <button onClick={handleCancel} className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 font-bold px-6 py-2 rounded-xl shadow hover:from-gray-400 hover:to-gray-500 transition">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditMode(true)} className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold px-6 py-2 rounded-xl shadow hover:from-indigo-700 hover:to-pink-600 transition">Edit Profile</button>
                <button onClick={handleDeleteAccount} className="bg-gradient-to-r from-red-400 to-pink-400 text-white font-bold px-6 py-2 rounded-xl shadow hover:from-red-500 hover:to-pink-500 transition">Delete</button>
              </>
            )}
          </div>
          <div className="mt-8 w-full flex flex-col gap-2">
            <div className="flex gap-2 items-center justify-center">
              <span className="bg-indigo-200 text-indigo-700 px-3 py-1 rounded-full font-semibold text-xs">Verified</span>
              <span className="bg-pink-200 text-pink-700 px-3 py-1 rounded-full font-semibold text-xs">Active</span>
            </div>
            <div className="flex gap-2 items-center justify-center mt-2">
              <span className="text-xs text-gray-400">Last login: {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '--'}</span>
            </div>
          </div>
          {form.resume && (
            <div className="mt-6 w-full">
              <label className="block font-semibold text-indigo-700 mb-1">Resume</label>
              <div className="flex gap-2 items-center">
                <span className="text-indigo-600 font-semibold">{form.resume}</span>
              </div>
            </div>
          )}
          {(form.socials?.linkedin || form.socials?.github || form.socials?.portfolio) && (
            <div className="mt-6 w-full">
              <label className="block font-semibold text-indigo-700 mb-1">Social Links</label>
              {form.socials?.linkedin && <a href={form.socials.linkedin} target="_blank" rel="noopener noreferrer" className="block text-blue-700 underline mb-1">LinkedIn</a>}
              {form.socials?.github && <a href={form.socials.github} target="_blank" rel="noopener noreferrer" className="block text-gray-800 underline mb-1">GitHub</a>}
              {form.socials?.portfolio && <a href={form.socials.portfolio} target="_blank" rel="noopener noreferrer" className="block text-pink-700 underline">Portfolio</a>}
            </div>
          )}
        </div>
        {/* Right: Details, Stats, Skills, Activity */}
        <div className="flex-1 flex flex-col gap-8 p-10 min-h-full">
          {/* Education CRUD - Modern Card Style, Full CRUD, More Fields */}
          <section className="mt-10">
            <h3 className="text-2xl font-extrabold text-indigo-800 mb-4 flex items-center gap-2">
              <span>Education</span>
              {editMode && <button onClick={() => setForm({ ...form, education: [...(form.education || []), { institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '', location: '' }] })} className="ml-2 px-3 py-1 rounded bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition">+ Add</button>}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(form.education && form.education.length > 0) ? form.education.map((edu: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 flex flex-col gap-2 relative">
                  {editMode ? (
                    <>
                      <div className="flex flex-col gap-2">
                        <input className="border-b border-indigo-200 px-2 py-1 font-bold text-lg" placeholder="Institution" value={edu.institution || ''} onChange={e => { const arr = [...form.education]; arr[idx].institution = e.target.value; setForm({ ...form, education: arr }); }} />
                        <div className="flex gap-2">
                          <input className="border-b border-indigo-200 px-2 py-1 flex-1" placeholder="Degree" value={edu.degree || ''} onChange={e => { const arr = [...form.education]; arr[idx].degree = e.target.value; setForm({ ...form, education: arr }); }} />
                          <input className="border-b border-indigo-200 px-2 py-1 flex-1" placeholder="Field" value={edu.field || ''} onChange={e => { const arr = [...form.education]; arr[idx].field = e.target.value; setForm({ ...form, education: arr }); }} />
                        </div>
                        <div className="flex gap-2">
                          <input className="border-b border-indigo-200 px-2 py-1 flex-1" placeholder="Start Year" value={edu.startYear || ''} onChange={e => { const arr = [...form.education]; arr[idx].startYear = e.target.value; setForm({ ...form, education: arr }); }} />
                          <input className="border-b border-indigo-200 px-2 py-1 flex-1" placeholder="End Year" value={edu.endYear || ''} onChange={e => { const arr = [...form.education]; arr[idx].endYear = e.target.value; setForm({ ...form, education: arr }); }} />
                        </div>
                        <div className="flex gap-2">
                          <input className="border-b border-indigo-200 px-2 py-1 flex-1" placeholder="Grade/CGPA" value={edu.grade || ''} onChange={e => { const arr = [...form.education]; arr[idx].grade = e.target.value; setForm({ ...form, education: arr }); }} />
                          <input className="border-b border-indigo-200 px-2 py-1 flex-1" placeholder="Location" value={edu.location || ''} onChange={e => { const arr = [...form.education]; arr[idx].location = e.target.value; setForm({ ...form, education: arr }); }} />
                        </div>
                      </div>
                      <button onClick={() => { const arr = [...form.education]; arr.splice(idx, 1); setForm({ ...form, education: arr }); }} className="absolute top-2 right-2 text-red-500 font-bold text-lg hover:text-red-700 transition">Delete</button>
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-xl text-indigo-900">{edu.institution}</div>
                      <div className="text-base text-gray-700">{edu.degree} in {edu.field}</div>
                      <div className="text-sm text-gray-500">{edu.startYear} - {edu.endYear}</div>
                      {(edu.grade || edu.location) && <div className="text-sm text-gray-500">{edu.grade && <>Grade: {edu.grade}</>} {edu.location && <>| {edu.location}</>}</div>}
                    </>
                  )}
                </div>
              )) : (
                <div className="text-gray-400 col-span-2">No education added.</div>
              )}
            </div>
          </section>

          {/* Achievements CRUD */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-indigo-700 mb-2">Achievements</h3>
            {editMode ? (
              <>
                {(form.achievements || []).map((ach: any, idx: number) => (
                  <div key={idx} className="flex gap-2 mb-2 items-center">
                    <input className="border rounded px-2 py-1" placeholder="Title" value={ach.title || ''} onChange={e => { const arr = [...form.achievements]; arr[idx].title = e.target.value; setForm({ ...form, achievements: arr }); }} />
                    <input className="border rounded px-2 py-1" placeholder="Description" value={ach.description || ''} onChange={e => { const arr = [...form.achievements]; arr[idx].description = e.target.value; setForm({ ...form, achievements: arr }); }} />
                    <input className="border rounded px-2 py-1" placeholder="Date" value={ach.date || ''} onChange={e => { const arr = [...form.achievements]; arr[idx].date = e.target.value; setForm({ ...form, achievements: arr }); }} />
                    <button onClick={() => { const arr = [...form.achievements]; arr.splice(idx, 1); setForm({ ...form, achievements: arr }); }} className="text-red-500 font-bold">Delete</button>
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, achievements: [...(form.achievements || []), { title: '', description: '', date: '' }] })} className="bg-pink-200 text-pink-800 px-3 py-1 rounded">Add Achievement</button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                {form.achievements && form.achievements.length > 0 ? form.achievements.map((ach: any, idx: number) => (
                  <div key={idx} className="bg-pink-50 rounded-lg p-3 shadow border border-pink-100">
                    <div className="font-semibold text-pink-800">{ach.title}</div>
                    <div className="text-sm text-gray-700">{ach.description}</div>
                    <div className="text-xs text-gray-500">{ach.date}</div>
                  </div>
                )) : <span className="text-gray-400">No achievements added.</span>}
              </div>
            )}
          </div>

          {/* Projects CRUD */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-indigo-700 mb-2">Projects</h3>
            {editMode ? (
              <>
                {(form.projects || []).map((proj: any, idx: number) => (
                  <div key={idx} className="flex gap-2 mb-2 items-center">
                    <input className="border rounded px-2 py-1" placeholder="Name" value={proj.name || ''} onChange={e => { const arr = [...form.projects]; arr[idx].name = e.target.value; setForm({ ...form, projects: arr }); }} />
                    <input className="border rounded px-2 py-1" placeholder="Description" value={proj.description || ''} onChange={e => { const arr = [...form.projects]; arr[idx].description = e.target.value; setForm({ ...form, projects: arr }); }} />
                    <input className="border rounded px-2 py-1" placeholder="Link" value={proj.link || ''} onChange={e => { const arr = [...form.projects]; arr[idx].link = e.target.value; setForm({ ...form, projects: arr }); }} />
                    <button onClick={() => { const arr = [...form.projects]; arr.splice(idx, 1); setForm({ ...form, projects: arr }); }} className="text-red-500 font-bold">Delete</button>
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, projects: [...(form.projects || []), { name: '', description: '', link: '' }] })} className="bg-blue-200 text-blue-800 px-3 py-1 rounded">Add Project</button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                {form.projects && form.projects.length > 0 ? form.projects.map((proj: any, idx: number) => (
                  <div key={idx} className="bg-blue-50 rounded-lg p-3 shadow border border-blue-100">
                    <div className="font-semibold text-blue-800">{proj.name}</div>
                    <div className="text-sm text-gray-700">{proj.description}</div>
                    {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">{proj.link}</a>}
                  </div>
                )) : <span className="text-gray-400">No projects added.</span>}
              </div>
            )}
          </div>

          {/* Certifications CRUD */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-indigo-700 mb-2">Certifications</h3>
            {editMode ? (
              <>
                {(form.certifications || []).map((cert: any, idx: number) => (
                  <div key={idx} className="flex gap-2 mb-2 items-center">
                    <input className="border rounded px-2 py-1" placeholder="Name" value={cert.name || ''} onChange={e => { const arr = [...form.certifications]; arr[idx].name = e.target.value; setForm({ ...form, certifications: arr }); }} />
                    <input className="border rounded px-2 py-1" placeholder="Issuer" value={cert.issuer || ''} onChange={e => { const arr = [...form.certifications]; arr[idx].issuer = e.target.value; setForm({ ...form, certifications: arr }); }} />
                    <input className="border rounded px-2 py-1" placeholder="Date" value={cert.date || ''} onChange={e => { const arr = [...form.certifications]; arr[idx].date = e.target.value; setForm({ ...form, certifications: arr }); }} />
                    <button onClick={() => { const arr = [...form.certifications]; arr.splice(idx, 1); setForm({ ...form, certifications: arr }); }} className="text-red-500 font-bold">Delete</button>
                  </div>
                ))}
                <button onClick={() => setForm({ ...form, certifications: [...(form.certifications || []), { name: '', issuer: '', date: '' }] })} className="bg-green-200 text-green-800 px-3 py-1 rounded">Add Certification</button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                {form.certifications && form.certifications.length > 0 ? form.certifications.map((cert: any, idx: number) => (
                  <div key={idx} className="bg-green-50 rounded-lg p-3 shadow border border-green-100">
                    <div className="font-semibold text-green-800">{cert.name}</div>
                    <div className="text-sm text-gray-700">{cert.issuer}</div>
                    <div className="text-xs text-gray-500">{cert.date}</div>
                  </div>
                )) : <span className="text-gray-400">No certifications added.</span>}
              </div>
            )}
          </div>
          {/* Summary Cards */}
          {/* Placement/OD Stats (example, replace with dynamic if available) */}
          {user && user.placementStats && Array.isArray(user.placementStats) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-2">
              {user.placementStats.map((stat: any) => (
                <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-xl shadow p-5 flex flex-col items-center border border-indigo-100`}>
                  <span className="text-3xl mb-2">{stat.icon}</span>
                  <span className="text-lg font-semibold text-white drop-shadow">{stat.label}</span>
                  <span className="text-2xl font-extrabold text-white drop-shadow">{stat.value}</span>
                </div>
              ))}
            </div>
          )}
          {/* Skills & Interests */}
          <div className="flex flex-col md:flex-row gap-6 mt-2">
            {/* Skills */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-indigo-700">Skills</h3>
              {editMode && (
                <div className="flex gap-2">
                  <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add skill" className="border border-indigo-200 rounded-lg px-2 py-1" />
                  <button onClick={handleAddSkill} type="button" className="bg-indigo-500 text-white px-3 py-1 rounded-lg font-bold">Add</button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skills && form.skills.length > 0 ? (
                form.skills.map((skill: string) => (
                  <span key={skill} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-semibold text-sm flex items-center gap-1">
                    {skill}
                    {editMode && <button onClick={() => handleRemoveSkill(skill)} type="button" className="ml-1 text-indigo-400 hover:text-red-500">&times;</button>}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">No skills added. {editMode && 'Add your skills!'}</span>
              )}
            </div>
          </div>
            {/* Interests */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-indigo-700">Interests</h3>
              {editMode && (
                <div className="flex gap-2">
                  <input type="text" value={newInterest} onChange={e => setNewInterest(e.target.value)} placeholder="Add interest" className="border border-indigo-200 rounded-lg px-2 py-1" />
                  <button onClick={handleAddInterest} type="button" className="bg-pink-500 text-white px-3 py-1 rounded-lg font-bold">Add</button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {form.interests && form.interests.length > 0 ? (
                form.interests.map((interest: string) => (
                  <span key={interest} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-semibold text-sm flex items-center gap-1">
                    {interest}
                    {editMode && <button onClick={() => handleRemoveInterest(interest)} type="button" className="ml-1 text-pink-400 hover:text-red-500">&times;</button>}
                  </span>
                ))
              ) : (
                <span className="text-gray-400">No interests added. {editMode && 'Add your interests!'}</span>
              )}
            </div>
          </div>
          </div>
          {/* Recent Activity */}
          {/* Recent Activity */}
          {user && user.recent && user.recent.length > 0 && (
            <div className="mt-2">
              <h3 className="text-xl font-bold mb-2 text-indigo-700">Recent Activity</h3>
              <ul className="list-disc ml-8 text-gray-700 text-base space-y-1">
                {user.recent.map((item: string, idx: number) => <li key={idx}>{item}</li>)}
              </ul>
            </div>
          )}
          {/* Change Password */}
          <div className="flex justify-end mt-4">
            <button className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold px-6 py-2 rounded-xl shadow hover:from-indigo-600 hover:to-pink-600 transition">Change Password</button>
          </div>
          {/* Placement Badges */}
          {user && user.placementBadges && user.placementBadges.length > 0 && (
            <div className="mt-8 flex flex-col gap-2">
              <h3 className="text-lg font-bold text-indigo-700 mb-2">Placement Badges</h3>
              <div className="flex flex-wrap gap-2">
                {user.placementBadges.map((badge: string) => {
                  let color = '';
                  if (badge === 'Super Dream') color = 'from-yellow-400 to-yellow-200 text-yellow-900';
                  else if (badge === 'Dream') color = 'from-blue-400 to-blue-200 text-blue-900';
                  else if (badge === 'Mass Recruiter') color = 'from-gray-400 to-gray-200 text-gray-900';
                  else if (badge === 'Marquee') color = 'from-pink-400 to-pink-200 text-pink-900';
                  return (
                    <span key={badge} className={`bg-gradient-to-r ${color} px-4 py-1 rounded-full font-bold text-xs shadow`}>{badge}</span>
                  );
                })}
              </div>
            </div>
          )}
          {/* Education */}
          {form.education && form.education.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-indigo-700 mb-2">Education</h3>
              <div className="flex flex-col gap-2">
                {form.education.map((edu: any, idx: number) => (
                  <div key={idx} className="bg-indigo-50 rounded-lg p-3 shadow border border-indigo-100">
                    <div className="font-semibold text-indigo-800">{edu.institution}</div>
                    <div className="text-sm text-gray-700">{edu.degree} in {edu.field}</div>
                    <div className="text-xs text-gray-500">{edu.startYear} - {edu.endYear}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Achievements */}
          {form.achievements && form.achievements.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-indigo-700 mb-2">Achievements</h3>
              <div className="flex flex-col gap-2">
                {form.achievements.map((ach: any, idx: number) => (
                  <div key={idx} className="bg-pink-50 rounded-lg p-3 shadow border border-pink-100">
                    <div className="font-semibold text-pink-800">{ach.title}</div>
                    <div className="text-sm text-gray-700">{ach.description}</div>
                    <div className="text-xs text-gray-500">{ach.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Projects */}
          {form.projects && form.projects.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-indigo-700 mb-2">Projects</h3>
              <div className="flex flex-col gap-2">
                {form.projects.map((proj: any, idx: number) => (
                  <div key={idx} className="bg-blue-50 rounded-lg p-3 shadow border border-blue-100">
                    <div className="font-semibold text-blue-800">{proj.name}</div>
                    <div className="text-sm text-gray-700">{proj.description}</div>
                    {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">{proj.link}</a>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Certifications */}
          {form.certifications && form.certifications.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-indigo-700 mb-2">Certifications</h3>
              <div className="flex flex-col gap-2">
                {form.certifications.map((cert: any, idx: number) => (
                  <div key={idx} className="bg-green-50 rounded-lg p-3 shadow border border-green-100">
                    <div className="font-semibold text-green-800">{cert.name}</div>
                    <div className="text-sm text-gray-700">{cert.issuer}</div>
                    <div className="text-xs text-gray-500">{cert.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Delete Modal */}
        {showDelete && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Account?</h2>
              <p className="mb-6 text-gray-700 text-center">Are you sure you want to delete your account? This action cannot be undone.</p>
              <div className="flex gap-4 w-full">
                <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white font-bold py-2 rounded-xl shadow hover:bg-red-600 transition">Delete</button>
                <button onClick={() => setShowDelete(false)} className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-xl shadow hover:bg-gray-300 transition">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
