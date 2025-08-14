import { motion } from 'framer-motion';
import { Chart as ApexChart } from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { cn } from '@/utils/cn';

const KPICard = ({ title, value, change, icon, format = 'number' }) => {
  const isPositive = change > 0;
  const formattedValue = format === 'currency' 
    ? `$${value.toLocaleString()}` 
    : format === 'percentage'
    ? `${value}%`
    : value.toLocaleString();
  
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-primary-100 rounded-lg">
          <ApperIcon name={icon} className="w-4 h-4 text-primary-600" />
        </div>
        <Badge variant={isPositive ? 'success' : 'error'} className="text-xs">
          {isPositive ? '+' : ''}{change}%
        </Badge>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{formattedValue}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );
};

const DataTable = ({ data, columns, title }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <h4 className="font-semibold text-gray-900">{title}</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.slice(0, 8).map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                    {column.format === 'currency' 
                      ? `$${row[column.key].toLocaleString()}`
                      : column.format === 'percentage'
                      ? `${row[column.key]}%`
                      : row[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TrendChart = ({ data, title, type = 'line' }) => {
  const chartOptions = {
    chart: {
      type,
      height: 300,
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    colors: ['#4A5FF7', '#10B981', '#F59E0B'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: data.months,
      labels: {
        style: { colors: '#6B7280', fontSize: '12px' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#6B7280', fontSize: '12px' }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4
    },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px' }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    }
  };

  const chartSeries = [{
    name: title,
    data: data.values
  }];

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4">
      <h4 className="font-semibold text-gray-900 mb-4">{title} Trend</h4>
      <ApexChart 
        options={chartOptions}
        series={chartSeries}
        type={type}
        height={300}
      />
    </div>
  );
};

const ReportDisplay = ({ reportData, reportType, reportId, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-full flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-500">Generating report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="BarChart3" className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Report</h3>
          <p className="text-gray-500">Choose a category and report from the left panel to view analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-full">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 capitalize">
          {reportType} {reportId} Report
        </h3>
        <p className="text-gray-500 mt-1">Real-time analytics and insights</p>
      </div>
      
      <div className="p-6 max-h-[600px] overflow-y-auto space-y-6">
        {/* KPIs Section */}
        {reportType === 'employee' && reportData.headcount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <KPICard 
              title="Total Employees"
              value={reportData.headcount.total}
              change={5.2}
              icon="Users"
            />
            <KPICard 
              title="Active"
              value={reportData.headcount.active}
              change={3.1}
              icon="UserCheck"
            />
            <KPICard 
              title="On Leave"
              value={reportData.headcount.onLeave}
              change={-12.5}
              icon="UserMinus"
            />
            <KPICard 
              title="Departments"
              value={reportData.departmentBreakdown?.length || 0}
              change={0}
              icon="Building2"
            />
          </motion.div>
        )}

        {reportType === 'payroll' && reportData.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <KPICard 
              title="Total Gross"
              value={reportData.summary.totalGross}
              change={8.7}
              icon="DollarSign"
              format="currency"
            />
            <KPICard 
              title="Total Net"
              value={reportData.summary.totalNet}
              change={6.4}
              icon="Wallet"
              format="currency"
            />
            <KPICard 
              title="Taxes"
              value={reportData.summary.totalTaxes}
              change={-2.3}
              icon="Receipt"
              format="currency"
            />
            <KPICard 
              title="Benefits"
              value={reportData.summary.totalBenefits}
              change={4.8}
              icon="Heart"
              format="currency"
            />
          </motion.div>
        )}

        {reportType === 'attendance' && reportData.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <KPICard 
              title="Total Hours"
              value={reportData.summary.totalHours}
              change={2.1}
              icon="Clock"
            />
            <KPICard 
              title="Overtime"
              value={reportData.summary.totalOvertime}
              change={-5.3}
              icon="Timer"
            />
            <KPICard 
              title="Attendance Rate"
              value={reportData.summary.averageAttendanceRate}
              change={1.2}
              icon="CheckCircle"
              format="percentage"
            />
            <KPICard 
              title="Leave Hours"
              value={reportData.summary.totalLeave}
              change={-8.7}
              icon="Calendar"
            />
          </motion.div>
        )}

        {reportType === 'department' && reportData.departments && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <KPICard 
              title="Total Budget"
              value={reportData.totalBudget}
              change={3.4}
              icon="DollarSign"
              format="currency"
            />
            <KPICard 
              title="Departments"
              value={reportData.departments.length}
              change={0}
              icon="Building2"
            />
            <KPICard 
              title="Total Headcount"
              value={reportData.totalHeadcount}
              change={5.2}
              icon="Users"
            />
            <KPICard 
              title="Avg Productivity"
              value={Math.round(reportData.departments.reduce((sum, d) => sum + d.productivity, 0) / reportData.departments.length)}
              change={2.8}
              icon="TrendingUp"
              format="percentage"
            />
          </motion.div>
        )}

        {/* Charts Section */}
        {reportData.trendData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <TrendChart 
              data={reportData.trendData}
              title={`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Trends`}
            />
            
            {reportData.departmentBreakdown && (
              <div className="bg-white rounded-lg border border-gray-100 p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Department Distribution</h4>
                <ApexChart 
                  options={{
                    chart: { type: 'donut', fontFamily: 'Inter, sans-serif' },
                    colors: ['#4A5FF7', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'],
                    labels: reportData.departmentBreakdown.map(d => d.department),
                    legend: { position: 'bottom' },
                    tooltip: { theme: 'light' }
                  }}
                  series={reportData.departmentBreakdown.map(d => d.count)}
                  type="donut"
                  height={300}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* Data Tables Section */}
        {reportData.performance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <DataTable 
              data={reportData.performance}
              columns={[
                { key: 'name', title: 'Employee' },
                { key: 'department', title: 'Department' },
                { key: 'position', title: 'Position' },
                { key: 'performanceScore', title: 'Score', format: 'percentage' },
                { key: 'goalsCompleted', title: 'Goals' }
              ]}
              title="Performance Overview"
            />
          </motion.div>
        )}

        {reportData.departmentCosts && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <DataTable 
              data={reportData.departmentCosts}
              columns={[
                { key: 'department', title: 'Department' },
                { key: 'cost', title: 'Annual Cost', format: 'currency' }
              ]}
              title="Department Costs"
            />
          </motion.div>
        )}

        {reportData.departments && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <DataTable 
              data={reportData.departments}
              columns={[
                { key: 'department', title: 'Department' },
                { key: 'headcount', title: 'Headcount' },
                { key: 'budget', title: 'Budget', format: 'currency' },
                { key: 'productivity', title: 'Productivity', format: 'percentage' },
                { key: 'manager', title: 'Manager' }
              ]}
              title="Department Overview"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReportDisplay;