import { getAllEmployees } from './employeeService';
import { getAllPayPeriods } from './payrollService';
import { format, parseISO, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';

// Mock delay to simulate API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Department mappings for organizational reports
const departmentBudgets = {
  'Engineering': 450000,
  'Product': 280000,
  'Design': 220000,
  'Marketing': 310000,
  'Sales': 380000,
  'Human Resources': 180000,
  'Finance': 200000,
  'Analytics': 160000,
  'Customer Success': 190000
};

// Generate employee reports data
export const getEmployeeReports = async (filters = {}) => {
  await delay(400);
  const employees = await getAllEmployees();
  
  const { dateRange, department, status } = filters;
  let filteredEmployees = employees;
  
  // Apply filters
  if (department && department !== 'all') {
    filteredEmployees = employees.filter(emp => emp.department === department);
  }
  
  if (status && status !== 'all') {
    filteredEmployees = employees.filter(emp => emp.status === status);
  }
  
  // Headcount metrics
  const headcount = {
    total: filteredEmployees.length,
    active: filteredEmployees.filter(emp => emp.status === 'Active').length,
    inactive: filteredEmployees.filter(emp => emp.status === 'Inactive').length,
    onLeave: filteredEmployees.filter(emp => emp.status === 'Leave').length
  };
  
  // Demographics breakdown
  const departmentBreakdown = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {});
  
  // Performance metrics (simulated)
  const performance = filteredEmployees.map(emp => ({
    Id: emp.Id,
    name: `${emp.firstName} ${emp.lastName}`,
    department: emp.department,
    position: emp.position,
    performanceScore: Math.floor(Math.random() * 40) + 60, // 60-100
    goalsCompleted: Math.floor(Math.random() * 15) + 5,
    reviewDate: format(subMonths(new Date(), Math.floor(Math.random() * 6)), 'yyyy-MM-dd')
  }));
  
  return {
    headcount,
    departmentBreakdown: Object.entries(departmentBreakdown).map(([dept, count]) => ({
      department: dept,
      count
    })),
    performance,
    trendData: generateTrendData('headcount')
  };
};

// Generate payroll reports data
export const getPayrollReports = async (filters = {}) => {
  await delay(400);
  const payPeriods = await getAllPayPeriods();
  const employees = await getAllEmployees();
  
  const { dateRange } = filters;
  let filteredPeriods = payPeriods;
  
  if (dateRange?.start && dateRange?.end) {
    filteredPeriods = payPeriods.filter(period => {
      const periodStart = parseISO(period.payPeriodStart);
      return isWithinInterval(periodStart, {
        start: parseISO(dateRange.start),
        end: parseISO(dateRange.end)
      });
    });
  }
  
  // Calculate costs and taxes
  const totalGross = filteredPeriods.reduce((sum, period) => sum + period.totalGross, 0);
  const totalNet = filteredPeriods.reduce((sum, period) => sum + period.totalNet, 0);
  const totalTaxes = totalGross - totalNet;
  
  // Benefits breakdown (simulated)
  const benefits = {
    healthInsurance: totalGross * 0.12,
    retirement: totalGross * 0.06,
    dental: totalGross * 0.02,
    vision: totalGross * 0.01,
    lifeInsurance: totalGross * 0.005
  };
  
  // Department payroll costs
  const departmentCosts = employees.reduce((acc, emp) => {
    const avgSalary = totalGross / employees.length / filteredPeriods.length * 26; // Annualized
    acc[emp.department] = (acc[emp.department] || 0) + avgSalary;
    return acc;
  }, {});
  
  return {
    summary: {
      totalGross,
      totalNet,
      totalTaxes,
      totalBenefits: Object.values(benefits).reduce((sum, val) => sum + val, 0),
      payPeriods: filteredPeriods.length
    },
    benefits,
    departmentCosts: Object.entries(departmentCosts).map(([dept, cost]) => ({
      department: dept,
      cost: Math.round(cost)
    })),
    trendData: generateTrendData('payroll')
  };
};

// Generate attendance reports data
export const getAttendanceReports = async (filters = {}) => {
  await delay(400);
  const employees = await getAllEmployees();
  
  // Simulate attendance data
  const attendanceData = employees.map(emp => {
    const hoursWorked = Math.floor(Math.random() * 20) + 160; // 160-180 hours/month
    const overtimeHours = Math.max(0, hoursWorked - 160);
    const leaveHours = Math.floor(Math.random() * 16); // 0-16 hours leave
    
    return {
      Id: emp.Id,
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      hoursWorked,
      overtimeHours,
      leaveHours,
      attendanceRate: Math.floor(Math.random() * 15) + 85, // 85-100%
      lateArrivals: Math.floor(Math.random() * 5),
      earlyDepartures: Math.floor(Math.random() * 3)
    };
  });
  
  // Aggregate metrics
  const totalHours = attendanceData.reduce((sum, emp) => sum + emp.hoursWorked, 0);
  const totalOvertime = attendanceData.reduce((sum, emp) => sum + emp.overtimeHours, 0);
  const totalLeave = attendanceData.reduce((sum, emp) => sum + emp.leaveHours, 0);
  const avgAttendanceRate = attendanceData.reduce((sum, emp) => sum + emp.attendanceRate, 0) / attendanceData.length;
  
  return {
    summary: {
      totalHours: Math.round(totalHours),
      totalOvertime: Math.round(totalOvertime),
      totalLeave: Math.round(totalLeave),
      averageAttendanceRate: Math.round(avgAttendanceRate * 10) / 10,
      employeeCount: attendanceData.length
    },
    employeeAttendance: attendanceData,
    trendData: generateTrendData('attendance')
  };
};

// Generate department reports data
export const getDepartmentReports = async (filters = {}) => {
  await delay(400);
  const employees = await getAllEmployees();
  
  // Group by department
  const departments = employees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = [];
    }
    acc[emp.department].push(emp);
    return acc;
  }, {});
  
  // Calculate department metrics
  const departmentMetrics = Object.entries(departments).map(([deptName, deptEmployees]) => {
    const budget = departmentBudgets[deptName] || 200000;
    const headcount = deptEmployees.length;
    const avgSalary = budget / headcount;
    const productivity = Math.floor(Math.random() * 25) + 75; // 75-100%
    const utilization = Math.floor(Math.random() * 20) + 80; // 80-100%
    
    return {
      department: deptName,
      headcount,
      budget,
      avgSalary: Math.round(avgSalary),
      productivity,
      utilization,
      manager: deptEmployees[0]?.manager || 'TBD',
      activeProjects: Math.floor(Math.random() * 8) + 3
    };
  });
  
  return {
    departments: departmentMetrics,
    totalBudget: Object.values(departmentBudgets).reduce((sum, budget) => sum + budget, 0),
    totalHeadcount: employees.length,
    trendData: generateTrendData('departments')
  };
};

// Generate trend data for charts
const generateTrendData = (type) => {
  const months = [];
  const values = [];
  
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    months.push(format(date, 'MMM yyyy'));
    
    let baseValue;
    switch (type) {
      case 'headcount':
        baseValue = 45 + Math.floor(Math.random() * 10);
        break;
      case 'payroll':
        baseValue = 85000 + Math.floor(Math.random() * 10000);
        break;
      case 'attendance':
        baseValue = 92 + Math.floor(Math.random() * 6);
        break;
      case 'departments':
        baseValue = 8 + Math.floor(Math.random() * 2);
        break;
      default:
        baseValue = 100;
    }
    
    values.push(baseValue);
  }
  
  return { months, values };
};

// Export report data
export const exportReport = async (reportType, format, data) => {
  await delay(1000);
  
  // Simulate file generation
  const fileName = `${reportType}_report_${format(new Date(), 'yyyy-MM-dd')}.${format.toLowerCase()}`;
  
  // In a real app, this would generate and download the actual file
  return {
    success: true,
    fileName,
    message: `Report exported successfully as ${format}`
  };
};

// Get available report categories
export const getReportCategories = () => {
  return [
    {
      id: 'employee',
      name: 'Employee Reports',
      icon: 'Users',
      reports: [
        { id: 'headcount', name: 'Headcount Analysis', description: 'Employee count and distribution' },
        { id: 'demographics', name: 'Demographics', description: 'Department and role breakdown' },
        { id: 'performance', name: 'Performance Metrics', description: 'Employee performance tracking' }
      ]
    },
    {
      id: 'payroll',
      name: 'Payroll Reports',
      icon: 'DollarSign',
      reports: [
        { id: 'costs', name: 'Payroll Costs', description: 'Total compensation analysis' },
        { id: 'taxes', name: 'Tax Summary', description: 'Tax deductions and compliance' },
        { id: 'benefits', name: 'Benefits Analysis', description: 'Employee benefits breakdown' }
      ]
    },
    {
      id: 'attendance',
      name: 'Attendance Reports',
      icon: 'Clock',
      reports: [
        { id: 'tracking', name: 'Time Tracking', description: 'Hours worked and productivity' },
        { id: 'leave', name: 'Leave Analysis', description: 'PTO and absence patterns' },
        { id: 'overtime', name: 'Overtime Summary', description: 'Overtime hours and costs' }
      ]
    },
    {
      id: 'department',
      name: 'Department Reports',
      icon: 'Building2',
      reports: [
        { id: 'organizational', name: 'Organizational Structure', description: 'Department hierarchy and roles' },
        { id: 'budget', name: 'Budget Analysis', description: 'Department budget utilization' },
        { id: 'productivity', name: 'Productivity Metrics', description: 'Department performance indicators' }
      ]
    }
  ];
};