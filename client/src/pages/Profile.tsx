import React, { useEffect, useState } from 'react';

// Navbar import removed to avoid duplicate navbars
const Profile: React.FC = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    // Decode JWT to get user info (for demo, not secure for production)
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ name: payload.name, email: payload.email });
        setName(payload.name);
        // avatar not available in token, handle separately if needed
      } catch {
        setUser(null);
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => prev ? { name, email: prev.email } : null);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 p-6">
      <div className="max-w-2xl mx-auto bg-white/90 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Profile</h1>
        {user ? (
          <div className="space-y-4">
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
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
