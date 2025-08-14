import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getDashboardMetrics, getRecentActivity } from "@/services/api/dashboardService";

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [metricsData, activitiesData] = await Promise.all([
        getDashboardMetrics(),
        getRecentActivity()
      ]);
      
      setMetrics(metricsData);
      setActivities(activitiesData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Loading type="metrics" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back, HR Manager!</h1>
        <p className="text-primary-100">Here's what's happening with your team today.</p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MetricCard
              title={metric.label}
              value={metric.value}
              change={metric.change}
              trend={metric.trend}
              icon={metric.icon}
              gradient={metric.gradient}
            />
          </motion.div>
        ))}
      </div>
{/* Bottom Section - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity - 60% */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {activities.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                onClick={() => {
                  // Navigate to relevant section based on activity type
                  if (activity.type === 'hire' || activity.type === 'promotion') {
                    window.location.href = '/employees';
                  } else if (activity.type === 'departure') {
                    window.location.href = '/employees';  
                  }
                }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.bgColor}`}>
                  <span className={`text-xs font-medium ${activity.textColor}`}>
                    {activity.type.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 font-medium">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions - 40% */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/employees'}
              className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-primary-50 hover:border-primary-200 transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 text-xs font-medium">👥</span>
              </div>
              <span className="text-sm font-medium text-gray-700">View All Employees</span>
            </button>
            
            <button
              onClick={() => window.location.href = '/employees'}
              className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-success-50 hover:border-success-200 transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-success-100 flex items-center justify-center">
                <span className="text-success-600 text-xs font-medium">➕</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Add New Employee</span>
            </button>

            <button
              onClick={() => window.location.href = '/time-attendance'}
              className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-warning-50 hover:border-warning-200 transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-warning-100 flex items-center justify-center">
                <span className="text-warning-600 text-xs font-medium">⏰</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Time & Attendance</span>
            </button>

            <button
              onClick={() => window.location.href = '/payroll'}
              className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 text-xs font-medium">💰</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Payroll Management</span>
            </button>

            <button
              onClick={() => window.location.href = '/reports'}
              className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 text-xs font-medium">📊</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Generate Reports</span>
            </button>

            <button
              onClick={() => window.location.href = '/departments'}
              className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 text-xs font-medium">🏢</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Manage Departments</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;