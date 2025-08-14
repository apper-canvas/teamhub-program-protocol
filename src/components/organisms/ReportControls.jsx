import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const ReportControls = ({ 
  filters, 
  onFiltersChange, 
  onExport, 
  isExporting,
  reportType,
  reportId 
}) => {
  const [dateRange, setDateRange] = useState({
    start: filters.dateRange?.start || format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
    end: filters.dateRange?.end || format(new Date(), 'yyyy-MM-dd')
  });

  const departments = [
    'Engineering', 'Product', 'Design', 'Marketing', 
    'Sales', 'Human Resources', 'Finance', 'Analytics', 'Customer Success'
  ];

  const statuses = ['Active', 'Inactive', 'Leave'];

  const exportFormats = ['PDF', 'Excel', 'CSV'];

  const presetRanges = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 },
    { label: 'This year', days: 365 }
  ];

  const handleDateRangeChange = (field, value) => {
    const newRange = { ...dateRange, [field]: value };
    setDateRange(newRange);
    onFiltersChange({ ...filters, dateRange: newRange });
  };

  const handlePresetRange = (days) => {
    const end = new Date();
    const start = new Date(end.getTime() - (days * 24 * 60 * 60 * 1000));
    
    const newRange = {
      start: format(start, 'yyyy-MM-dd'),
      end: format(end, 'yyyy-MM-dd')
    };
    
    setDateRange(newRange);
    onFiltersChange({ ...filters, dateRange: newRange });
  };

  const handleExport = async (format) => {
    if (!reportType || !reportId) {
      toast.error('Please select a report first');
      return;
    }
    
    try {
      await onExport(format);
      toast.success(`Report exported as ${format}`);
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-full">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <ApperIcon name="Settings" className="w-4 h-4 mr-2" />
          Report Controls
        </h3>
      </div>
      
      <div className="p-4 space-y-6 max-h-[600px] overflow-y-auto">
        {/* Date Range Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h4 className="font-medium text-gray-900 flex items-center">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
            Date Range
          </h4>
          
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-700">Quick Select</p>
            <div className="grid grid-cols-1 gap-1">
              {presetRanges.map((preset) => (
                <button
                  key={preset.days}
                  onClick={() => handlePresetRange(preset.days)}
                  className="text-left px-2 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h4 className="font-medium text-gray-900 flex items-center">
            <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
            Filters
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
              <select
                value={filters.department || 'all'}
                onChange={(e) => onFiltersChange({ ...filters, department: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            {reportType === 'employee' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status || 'all'}
                  onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            )}
            
            <Button
              onClick={() => onFiltersChange({})}
              variant="outline"
              className="w-full text-sm"
            >
              <ApperIcon name="RotateCcw" className="w-3 h-3 mr-2" />
              Reset Filters
            </Button>
          </div>
        </motion.div>

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h4 className="font-medium text-gray-900 flex items-center">
            <ApperIcon name="Download" className="w-4 h-4 mr-2" />
            Export Options
          </h4>
          
          <div className="space-y-2">
            {exportFormats.map((format) => (
              <Button
                key={format}
                onClick={() => handleExport(format)}
                disabled={isExporting || !reportType || !reportId}
                variant="outline"
                className="w-full text-sm justify-start"
              >
                <ApperIcon 
                  name={format === 'PDF' ? 'FileText' : format === 'Excel' ? 'Sheet' : 'Database'} 
                  className="w-4 h-4 mr-2" 
                />
                {isExporting ? 'Exporting...' : `Export as ${format}`}
              </Button>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <ApperIcon name="Info" className="w-4 h-4 text-primary-600 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-900">Export Information</p>
                <p className="text-xs text-gray-600 mt-1">
                  Reports include filtered data and current date range. 
                  PDF includes charts and visualizations.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Section */}
        {(reportType && reportId) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h4 className="font-medium text-gray-900 flex items-center">
              <ApperIcon name="FileBarChart" className="w-4 h-4 mr-2" />
              Current Report
            </h4>
            
            <div className="bg-primary-50 rounded-lg p-3 border border-primary-200">
              <p className="text-sm font-medium text-primary-900 capitalize">
                {reportType} - {reportId}
              </p>
              <p className="text-xs text-primary-700 mt-1">
                {format(new Date(dateRange.start), 'MMM d, yyyy')} - {format(new Date(dateRange.end), 'MMM d, yyyy')}
              </p>
              {filters.department && filters.department !== 'all' && (
                <p className="text-xs text-primary-700">
                  Department: {filters.department}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReportControls;