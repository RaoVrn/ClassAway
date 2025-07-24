import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

// Placeholder: Replace with real API/user context
const getUser = () => ({
  name: 'Varun Prakash',
  email: 'varun@example.com',
  avatar: '',
});

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '', avatar: '' });
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const u = getUser();
    setUser(u);
    setName(u.name);
    setAvatar(u.avatar);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({ ...prev, name, avatar }));
    setEditMode(false);
    // TODO: Call backend to update user info
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleDeleteAccount = () => {
    // TODO: Call backend to delete account
    alert('Account deletion is not implemented in this demo.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-2">
      <Navbar />
      <div className="max-w-xl mx-auto bg-white/90 border border-indigo-100 rounded-2xl shadow-xl mt-10 p-8 sm:p-12">
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-indigo-700 via-pink-500 to-indigo-400 bg-clip-text text-transparent tracking-tight">Profile</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden mb-2 border-2 border-indigo-300">
            {avatar ? (
              <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
              </svg>
            )}
          </div>
          {editMode && (
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="mb-2" />
          )}
        </div>
        {editMode ? (
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <label className="text-left font-semibold">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="border rounded px-3 py-2" />
            <button type="submit" className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold py-2 rounded-xl shadow hover:scale-105 transition-all duration-200">Save</button>
            <button type="button" onClick={() => setEditMode(false)} className="text-gray-500 hover:underline">Cancel</button>
          </form>
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <div className="text-lg font-semibold">{user.name}</div>
            <div className="text-gray-500">{user.email}</div>
            <button onClick={() => setEditMode(true)} className="mt-2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold px-5 py-2 rounded-xl shadow hover:scale-105 transition-all duration-200">Edit Profile</button>
          </div>
        )}
        <hr className="my-8" />
        <div>
          <h3 className="text-xl font-bold mb-2">Recent Activity</h3>
          <ul className="list-disc ml-6 text-gray-700 text-sm">
            <li>OD applied: Hackathon - 20 July 2025</li>
            <li>Placement: Google - Interview scheduled</li>
            <li>Attendance alert: 80% after last OD</li>
          </ul>
        </div>
        <hr className="my-8" />
        <button onClick={handleDeleteAccount} className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold py-2 rounded-xl shadow hover:scale-105 transition-all duration-200">Delete Account</button>
      </div>
    </div>
  );
};

export default Profile;
