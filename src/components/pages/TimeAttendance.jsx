import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Settings from "@/components/pages/Settings";
import Departments from "@/components/pages/Departments";
import metrics from "@/services/mockData/metrics.json";
import activities from "@/services/mockData/activities.json";
import employeesData from "@/services/mockData/employees.json";
import { getEmployeesWithTimeStatus } from "@/services/api/employeeService";

const TimeAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getEmployeesWithTimeStatus();
        setEmployees(data);
      } catch (error) {
        console.error('Error loading employees:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatDuration = (startTime) => {
    if (!startTime) return '00:00:00';
    const now = new Date();
    const start = new Date(startTime);
    const diff = now - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'In': return 'success';
      case 'Break': return 'warning';
      case 'Out': return 'error';
      default: return 'secondary';
    }
  };

  const clockedInEmployees = employees.filter(emp => emp.timeStatus === 'In');
  const totalActiveHours = clockedInEmployees.reduce((total, emp) => {
    if (emp.clockInTime) {
      const duration = (new Date() - new Date(emp.clockInTime)) / (1000 * 60 * 60);
      return total + duration;
    }
    return total;
  }, 0);

  const lateArrivals = employees.filter(emp => emp.isLate).length;
  const earlyDepartures = employees.filter(emp => emp.isEarlyDeparture).length;

  const departments = [...new Set(employees.map(emp => emp.department))];

  const filteredEmployees = employees.filter(emp => {
    const matchesDepartment = departmentFilter === 'all' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || emp.timeStatus === statusFilter;
    return matchesDepartment && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Time & Attendance</h1>
            <p className="text-gray-500 mt-1">Track employee attendance and working hours</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time & Attendance</h1>
          <p className="text-gray-500 mt-1">Track employee attendance and working hours</p>
        </div>
      </div>

      {/* Today's Overview Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-lg p-3">
              <ApperIcon name="Clock" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Current Time</p>
              <p className="text-xl font-semibold">{formatTime(currentTime)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-lg p-3">
              <ApperIcon name="Users" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Currently Clocked In</p>
              <p className="text-xl font-semibold">
                {clockedInEmployees.length} ({Math.round((clockedInEmployees.length / employees.length) * 100)}%)
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-lg p-3">
              <ApperIcon name="Timer" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Total Hours Today</p>
              <p className="text-xl font-semibold">{totalActiveHours.toFixed(1)}h</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 rounded-lg p-3">
              <ApperIcon name="AlertTriangle" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/80 text-sm">Late/Early</p>
              <p className="text-xl font-semibold">{lateArrivals + earlyDepartures}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Live Clock Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <ApperIcon name="Activity" className="w-5 h-5 mr-2 text-primary-500" />
                Live Clock Status
              </h2>
              <div className="flex space-x-2">
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="In">Clocked In</option>
                  <option value="Out">Clocked Out</option>
                  <option value="Break">On Break</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredEmployees.map((employee) => (
              <motion.div
                key={employee.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">
                        {employee.firstName[0]}{employee.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{employee.department}</p>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(employee.timeStatus)}>
                    {employee.timeStatus}
                  </Badge>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Clock In</p>
                    <p className="font-medium">
                      {employee.clockInTime 
                        ? new Date(employee.clockInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                        : '--:--'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Duration</p>
                    <p className="font-medium font-mono">
                      {employee.timeStatus === 'In' || employee.timeStatus === 'Break' 
                        ? formatDuration(employee.clockInTime)
                        : '--:--:--'
                      }
                    </p>
                  </div>
                </div>
                
                {employee.isLate && (
                  <div className="mt-2 flex items-center text-red-600 text-xs">
                    <ApperIcon name="AlertCircle" className="w-3 h-3 mr-1" />
                    Late Arrival
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column - Quick Actions & Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Zap" className="w-5 h-5 mr-2 text-primary-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button className="flex items-center justify-center space-x-2" variant="outline">
                <ApperIcon name="Download" className="w-4 h-4" />
                <span>Export Report</span>
              </Button>
              <Button className="flex items-center justify-center space-x-2" variant="outline">
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <span>Schedule</span>
              </Button>
              <Button className="flex items-center justify-center space-x-2" variant="outline">
                <ApperIcon name="Bell" className="w-4 h-4" />
                <span>Notifications</span>
              </Button>
              <Button className="flex items-center justify-center space-x-2" variant="outline">
                <ApperIcon name="Settings" className="w-4 h-4" />
                <span>Settings</span>
              </Button>
            </div>
          </div>

          {/* Department Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Building2" className="w-5 h-5 mr-2 text-primary-500" />
              Department Overview
            </h3>
            <div className="space-y-3">
              {departments.map(dept => {
                const deptEmployees = employees.filter(emp => emp.department === dept);
                const deptClockedIn = deptEmployees.filter(emp => emp.timeStatus === 'In');
                const percentage = Math.round((deptClockedIn.length / deptEmployees.length) * 100);
                
                return (
                  <div key={dept} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{dept}</p>
                      <p className="text-sm text-gray-500">
                        {deptClockedIn.length}/{deptEmployees.length} present
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary-600">{percentage}%</p>
                      <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                        <div 
                          className="h-2 bg-primary-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TimeAttendance;