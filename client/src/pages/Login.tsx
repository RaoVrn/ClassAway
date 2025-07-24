import React, { useState } from 'react';
import { loginUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 px-2">
      <Navbar />
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <form
          onSubmit={handleLogin}
          className="bg-white/90 border border-indigo-100 rounded-2xl shadow-xl w-full max-w-md p-8 sm:p-10 flex flex-col gap-5"
        >
          <h2 className="text-3xl font-extrabold text-center mb-2 bg-gradient-to-r from-indigo-700 via-pink-500 to-indigo-400 bg-clip-text text-transparent tracking-tight">Login</h2>
          <p className="text-center text-gray-500 mb-2 text-sm">Sign in to your account to access your dashboard.</p>
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold py-3 rounded-xl shadow-md hover:scale-105 transition-all duration-200 text-base mt-2"
          >
            Login
          </button>
          <div className="text-center text-sm text-gray-600 mt-2">
            Don't have an account?{' '}
            <a
              href="/register"
              className="text-indigo-600 font-semibold hover:underline hover:text-pink-500 transition"
            >
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
