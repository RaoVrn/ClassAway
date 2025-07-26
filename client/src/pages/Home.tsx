import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaClipboardList,
  FaUserCheck,
  FaRocket,
  FaShieldAlt,
  FaRegClock,
  FaUserGraduate,
} from 'react-icons/fa';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-indigo-100 to-indigo-200 text-gray-800 flex flex-col overflow-x-hidden">
      {/* Navbar is now included globally in App.tsx */}
      {/* Hero */}
      <section className="relative text-center py-20 px-4 sm:px-6 bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 text-white overflow-hidden shadow-lg rounded-b-3xl">
        <svg className="absolute left-0 top-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 1440 320">
          <path fill="#fff" fillOpacity="0.3" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
        </svg>
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 drop-shadow-xl tracking-tight">
          <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-indigo-400 bg-clip-text text-transparent">
            ClassAway
          </span>
        </h1>
        <p className="text-xl sm:text-2xl max-w-2xl mx-auto font-normal mb-8">
          One place to manage <span className="font-semibold text-yellow-100">ODs</span>, <span className="font-semibold text-pink-100">placements</span>, and <span className="font-semibold text-indigo-100">attendance</span>.
        </p>
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="bg-white text-indigo-700 font-bold px-7 py-3 rounded-lg shadow-md hover:bg-yellow-100 hover:scale-105 transition-all duration-200 text-base border border-white"
          >
            🚀 Get Started
          </Link>
          {typeof window !== 'undefined' && localStorage.getItem('token') ? (
            <Link
              to="/dashboard"
              className="bg-white/10 border border-white/30 text-white font-semibold px-7 py-3 rounded-lg hover:bg-white hover:text-indigo-700 hover:scale-105 transition-all duration-200 text-base"
            >
              🎯 Explore Dashboard
            </Link>
          ) : (
            <Link
              to="/demo"
              className="bg-white/10 border border-white/30 text-white font-semibold px-7 py-3 rounded-lg hover:bg-white hover:text-indigo-700 hover:scale-105 transition-all duration-200 text-base"
            >
              🎯 Explore Dashboard
            </Link>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-white via-indigo-50 to-indigo-100">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-indigo-700 mb-10 tracking-tight">
          What You Can Do
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              icon: <FaClipboardList className="text-4xl text-indigo-500 mb-3" />,
              title: 'Apply ODs Easily',
              desc: 'Submit and view OD requests with full tracking.',
            },
            {
              icon: <FaUserCheck className="text-4xl text-pink-500 mb-3" />,
              title: 'Track Placements',
              desc: 'See where you stand across every placement stage.',
            },
            {
              icon: <FaRegClock className="text-4xl text-yellow-500 mb-3" />,
              title: 'Attendance Insights',
              desc: 'Instantly know how ODs affect your attendance.',
            },
            {
              icon: <FaUserGraduate className="text-4xl text-indigo-400 mb-3" />,
              title: 'Dashboard Overview',
              desc: 'All your activity in one personalized view.',
            },
            {
              icon: <FaRocket className="text-4xl text-pink-400 mb-3" />,
              title: 'Final-Year Focused',
              desc: 'Built for students juggling placements + classes.',
            },
            {
              icon: <FaShieldAlt className="text-4xl text-indigo-600 mb-3" />,
              title: 'Secure & Fast',
              desc: 'Modern tech stack. Your data stays private.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/95 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 p-6 text-center border border-indigo-100 hover:-translate-y-1 group cursor-pointer"
            >
              <div className="flex justify-center">{item.icon}</div>
              <h3 className="text-lg font-bold text-indigo-700 mb-1 group-hover:text-pink-500 transition-colors duration-200">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-500 text-white px-4 sm:px-6 flex items-center justify-center text-center relative rounded-2xl mx-2 my-8 shadow-lg">
        <div className="max-w-2xl w-full mx-auto relative z-10 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent">Why ClassAway?</span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-yellow-300 via-pink-400 to-indigo-400 rounded-full mb-6"></div>
          <p className="text-lg sm:text-xl leading-relaxed opacity-95 mb-2 font-medium">
            Final year is hectic.
          </p>
          <p className="text-base sm:text-lg leading-relaxed opacity-90 mb-2">
            Between interviews, exams, and attendance, it’s easy to miss something important.
          </p>
          <p className="text-base sm:text-lg leading-relaxed opacity-100 mt-2">
            <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent font-bold">ClassAway</span> helps you stay organized, so you can focus on what matters.
          </p>
        </div>
        <div className="hidden md:block absolute -top-20 -right-32 w-80 h-80 bg-pink-400 rounded-full opacity-30 blur-3xl z-0"></div>
        <div className="hidden md:block absolute -bottom-24 -left-32 w-80 h-80 bg-yellow-300 rounded-full opacity-20 blur-3xl z-0"></div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white px-4 sm:px-6 text-center shadow-inner rounded-2xl mx-2 my-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-700 mb-3">
          Start Now. Stay Ahead.
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-6">
          Join hundreds of students optimizing their final year with ClassAway.
        </p>
        <Link
          to="/register"
          className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-bold px-8 py-3 rounded-xl shadow-md hover:scale-105 transition-all duration-200 text-base"
        >
          Create Your Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-100 via-white to-pink-100 py-5 text-center text-sm text-gray-700 border-t mt-auto shadow-inner rounded-t-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <a
            href="https://github.com/RaoVrn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-700 font-semibold hover:underline hover:text-pink-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            GitHub
          </a>
          <span className="hidden sm:inline-block text-gray-400">|</span>
          <a
            href="https://www.linkedin.com/in/varun--prakash/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-700 font-semibold hover:underline hover:text-pink-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.034 0 3.595 1.997 3.595 4.59v5.606z"/></svg>
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
