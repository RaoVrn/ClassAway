import React, { useEffect, useState } from 'react';
import { fetchODs } from '../services/od';
import { fetchPlacements } from '../services/placement';
import { OD } from '../types/od';
import { Placement } from '../types/placement';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts';
import { BsBookHalf, BsBriefcaseFill, BsCalendarCheck, BsAwardFill } from 'react-icons/bs'; // OD Icons
import { IoStatsChartSharp, IoDocumentTextSharp } from 'react-icons/io5'; // General Icons
import { FaUserGraduate, FaUserTie } from 'react-icons/fa'; // User related icons
import { MdOutlinePendingActions, MdOutlineCancel } from 'react-icons/md'; // Status icons
import { IoIosStats } from 'react-icons/io'; // Stats icon

const COLORS = ['#6366f1', '#f472b6', '#facc15', '#34d399'];

const Dashboard: React.FC = () => {
  const [ods, setOds] = useState<OD[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State to hold error messages

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null); // Reset error state on new fetch
      try {
        const [odsData, placementsData] = await Promise.all([
          fetchODs(),
          fetchPlacements(),
        ]);
        setOds(odsData);
        setPlacements(placementsData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load data. Please check your network connection and ensure the backend services are running. Also, check the browser's developer console for more specific error messages.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // OD Stats
  const odStats = {
    total: ods.length,
    placement: ods.filter(o => o.type === 'Placement').length,
    self: ods.filter(o => o.type === 'Self-Applied').length,
    approved: ods.filter(o => o.status === 'Approved').length,
    inProcess: ods.filter(o => o.status === 'In Process').length,
    rejected: ods.filter(o => o.status === 'Rejected').length,
  };

  // Placement Stats
  const placementStats = {
    total: placements.length,
    offer: placements.filter(p => p.status === 'Offer').length,
    interview: placements.filter(p => p.status === 'Interview').length,
    test: placements.filter(p => p.status === 'Test').length,
    shortlisted: placements.filter(p => p.status === 'Shortlisted').length, // Added shortlisted
  };

  // Charts
  const odPieData = [
    { name: 'Placement', value: odStats.placement },
    { name: 'Self-Applied', value: odStats.self },
  ];

  const odStatusData = [
    { name: 'Approved', value: odStats.approved },
    { name: 'In Process', value: odStats.inProcess },
    { name: 'Rejected', value: odStats.rejected },
  ];

  const odTrendData = ods.map((od, index) => ({
    date: od.date?.slice(0, 10) || `Day ${index + 1}`,
    count: 1,
  }));

  // Data transformation for Stacked Bar Chart
  const processPlacementDataForStack = (placementsData: Placement[]) => {
    const companyDataMap = new Map<string, { [key: string]: number }>();
    const statusOrder = ['Offer', 'Interview', 'Test', 'Shortlisted']; // Define order for consistent stacking

    placementsData.forEach(p => {
      if (!companyDataMap.has(p.company)) {
        companyDataMap.set(p.company, { company: p.company });
      }
      const companyEntry = companyDataMap.get(p.company)!;
      companyEntry[p.status] = (companyEntry[p.status] || 0) + 1;
    });

    // Ensure all statuses are present for each company, even if count is 0, for consistent stacking
    const processedData = Array.from(companyDataMap.values()).map(companyEntry => {
      const finalEntry: any = { company: companyEntry.company };
      statusOrder.forEach(status => {
        finalEntry[status] = companyEntry[status] || 0;
      });
      return finalEntry;
    });

    return processedData;
  };

  const stackedPlacementData = processPlacementDataForStack(placements);

  // Custom Tooltip for Stacked Bar Chart
  const CustomStackedTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, item: any) => sum + item.value, 0);
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-lg mb-2">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={`item-${index}`} className="text-sm mb-1 flex items-center">
              <span className="w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: item.color }}></span>
              {item.name}: {item.value}
            </p>
          ))}
          <p className="font-semibold text-md mt-2 border-t border-gray-300 pt-1">Total: {total}</p>
        </div>
      );
    }
    return null;
  };

  const placementStatusColors = { Offer: '#34d399', Interview: '#facc15', Test: '#6366f1', Shortlisted: '#f472b6' };

  // Modified placementBarData to include status for each company
  const placementBarData = placements.map((p) => ({
    company: p.company,
    status: p.status,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-indigo-700 mb-4 flex items-center justify-center">
            <IoDocumentTextSharp className="mr-4 text-6xl text-indigo-500 animate-pulse" /> {/* Dashboard Icon */}
            ClassAway Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your central hub for tracking opportunities and placements. Get insights at a glance and stay organized.
          </p>
        </header>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 border-solid"></div>
            <p className="ml-4 text-xl text-indigo-600">Loading your data...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-10 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-xl flex flex-col items-center" role="alert">
            <div className="flex items-center mb-3">
              <svg className="h-8 w-8 text-red-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <strong className="font-bold text-2xl">Oops! Something went wrong.</strong>
            </div>
            <span className="block sm:inline text-lg mb-4">{error}</span>
            <p className="text-md mb-2">To help diagnose the issue:</p>
            <ul className="list-disc text-left text-md">
              <li>Check your internet connection.</li>
              <li>Ensure the backend server is running and accessible.</li>
              <li>Open your browser's developer console (usually F12) and look for network errors or specific API call failures.</li>
            </ul>
          </div>
        )}


        {!loading && !error && (ods.length > 0 || placements.length > 0) && (
          <>
            {/* OD Overview Section */}
            <section className="mb-16 bg-white shadow-xl rounded-xl p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <BsBookHalf className="h-10 w-10 text-indigo-500 mr-4" /> {/* OD Icon */}
                <h2 className="text-3xl font-extrabold text-indigo-700">OD Overview</h2>
              </div>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                A comprehensive summary of all your Opportunity Discovery (OD) applications, categorized by type and status.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total ODs" value={odStats.total} color="text-indigo-600" icon={<IoDocumentTextSharp className="h-8 w-8" />} />
                <StatCard title="Placement ODs" value={odStats.placement} color="text-pink-500" icon={<BsBriefcaseFill className="h-8 w-8" />} />
                <StatCard title="Self-Applied ODs" value={odStats.self} color="text-blue-500" icon={<FaUserTie className="h-8 w-8" />} />
                <StatCard title="Approved ODs" value={odStats.approved} color="text-green-500" icon={<BsAwardFill className="h-8 w-8" />} />
                <StatCard title="Pending ODs" value={odStats.inProcess} color="text-yellow-500" icon={<MdOutlinePendingActions className="h-8 w-8" />} />
                <StatCard title="Rejected ODs" value={odStats.rejected} color="text-red-500" icon={<MdOutlineCancel className="h-8 w-8" />} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                <ChartCard title="OD Type Distribution">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={odPieData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => `${value}`} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: '8px' }} labelStyle={{ color: 'white' }} />
                      <Bar dataKey="value" fill="#6366f1" barSize={30} radius={[10, 10, 0, 0]} animationBegin={0} animationDuration={500} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="OD Status Distribution">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={odStatusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => `${value}`} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: '8px' }} labelStyle={{ color: 'white' }} />
                      <Bar dataKey="value" fill="#f472b6" barSize={30} radius={[10, 10, 0, 0]} animationBegin={0} animationDuration={500} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              <div className="mt-10">
                <ChartCard title="OD Submissions Trend Over Time">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={odTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => `${value} ODs`} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: '8px' }} labelStyle={{ color: 'white' }} />
                      <Area type="monotone" dataKey="count" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} animationBegin={0} animationDuration={500} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </section>

            {/* Placement Overview Section */}
            <section className="mb-16 bg-white shadow-xl rounded-xl p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <BsBriefcaseFill className="h-10 w-10 text-pink-500 mr-4" /> {/* Placement Icon */}
                <h2 className="text-3xl font-extrabold text-pink-600">Placement Overview</h2>
              </div>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                Keep track of your job applications, from initial contact through interviews and final offers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Companies" value={placementStats.total} color="text-blue-600" icon={<IoStatsChartSharp className="h-8 w-8" />} />
                <StatCard title="Offers" value={placementStats.offer} color="text-green-500" icon={<BsAwardFill className="h-8 w-8" />} />
                <StatCard title="Interviews" value={placementStats.interview} color="text-yellow-500" icon={<BsCalendarCheck className="h-8 w-8" />} />
                <StatCard title="Tests" value={placementStats.test} color="text-purple-500" icon={<IoDocumentTextSharp className="h-8 w-8" />} />
                <StatCard title="Shortlisted" value={placementStats.shortlisted} color="text-cyan-500" icon={<FaUserTie className="h-8 w-8" />} />
              </div>

              <div className="mt-10">
                <ChartCard title="Placement Status by Company">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={stackedPlacementData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="company" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomStackedTooltip />} /> {/* Custom tooltip for stacked bars */}
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="Offer" stackId="1" fill={placementStatusColors.Offer} barSize={30} radius={[10, 10, 0, 0]} animationBegin={0} animationDuration={500} />
                      <Bar dataKey="Interview" stackId="1" fill={placementStatusColors.Interview} barSize={30} radius={[10, 10, 0, 0]} animationBegin={0} animationDuration={500} />
                      <Bar dataKey="Test" stackId="1" fill={placementStatusColors.Test} barSize={30} radius={[10, 10, 0, 0]} animationBegin={0} animationDuration={500} />
                      <Bar dataKey="Shortlisted" stackId="1" fill={placementStatusColors.Shortlisted} barSize={30} radius={[10, 10, 0, 0]} animationBegin={0} animationDuration={500} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="mb-10 bg-white shadow-xl rounded-xl p-8 border border-gray-200">
              <div className="flex items-center mb-6">
                <IoIosStats className="h-10 w-10 text-gray-600 mr-4" /> {/* Recent Activity Icon */}
                <h2 className="text-3xl font-extrabold text-gray-800">Recent Activity</h2>
              </div>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                A chronological log of your most recent OD applications and placement updates. Stay informed about your progress.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-indigo-600 mb-4">Recent ODs</h3>
                  <div className="bg-indigo-50 p-4 rounded-lg shadow-inner space-y-3">
                    {ods.slice(0, 5).map((od) => ( // Displaying 5 recent ODs
                      <div key={od._id} className="border-b border-indigo-200 pb-3 last:border-b-0 last:pb-0">
                        <p className="font-medium text-gray-800">{od.title} ({od.type})</p>
                        <p className={`text-sm font-semibold ${od.status === 'Approved' ? 'text-green-600' : od.status === 'In Process' ? 'text-yellow-500' : 'text-red-500'}`}>
                          Status: {od.status}
                        </p>
                        <p className="text-xs text-gray-500">Date: {od.date?.slice(0, 10)}</p>
                      </div>
                    ))}
                    {ods.length === 0 && <p className="text-gray-500">No ODs added yet.</p>}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-pink-600 mb-4">Recent Placements</h3>
                  <div className="bg-pink-50 p-4 rounded-lg shadow-inner space-y-3">
                    {placements.slice(0, 5).map((p) => ( // Displaying 5 recent placements
                      <div key={p._id} className="border-b border-pink-200 pb-3 last:border-b-0 last:pb-0">
                        <p className="font-medium text-gray-800">{p.company}</p>
                        <p className={`text-sm font-semibold ${p.status === 'Offer' ? 'text-green-600' : p.status === 'Interview' ? 'text-yellow-500' : p.status === 'Test' ? 'text-blue-500' : 'text-gray-500'}`}>
                          Status: {p.status}
                        </p>
                      </div>
                    ))}
                    {placements.length === 0 && <p className="text-gray-500">No placements added yet.</p>}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({
  title,
  value,
  color,
  icon, // Added icon prop
}: {
  title: string;
  value: number;
  color: string;
  icon?: React.ReactNode; // Make icon optional
}) => (
  <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col items-center justify-center transform hover:-translate-y-1">
    {icon && <div className="text-4xl mb-3 text-gray-700">{icon}</div>} {/* Display icon if provided */}
    <p className="text-base font-medium text-gray-600 mb-1">{title}</p>
    <h2 className={`text-3xl font-bold ${color}`}>{value}</h2>
  </div>
);

// Chart Card Wrapper
const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
    <h3 className="text-xl font-bold text-gray-800 mb-5">{title}</h3>
    {children}
  </div>
);

export default Dashboard;
