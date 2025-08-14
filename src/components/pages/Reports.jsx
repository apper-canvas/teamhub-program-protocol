import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ReportCategories from "@/components/organisms/ReportCategories";
import ReportDisplay from "@/components/organisms/ReportDisplay";
import ReportControls from "@/components/organisms/ReportControls";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import {
  getReportCategories,
  getEmployeeReports,
  getPayrollReports,
  getAttendanceReports,
  getDepartmentReports,
  exportReport
} from "@/services/api/reportService";
const Reports = () => {
  const [categories] = useState(getReportCategories());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: null,
    department: 'all',
    status: 'all'
  });

  const loadReportData = async (category, reportId, currentFilters = filters) => {
    if (!category || !reportId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let data;
      switch (category) {
        case 'employee':
          data = await getEmployeeReports(currentFilters);
          break;
        case 'payroll':
          data = await getPayrollReports(currentFilters);
          break;
        case 'attendance':
          data = await getAttendanceReports(currentFilters);
          break;
        case 'department':
          data = await getDepartmentReports(currentFilters);
          break;
        default:
          throw new Error('Invalid report category');
      }
      setReportData(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedReport(null);
    setReportData(null);
  };

  const handleReportSelect = (reportId) => {
    setSelectedReport(reportId);
    loadReportData(selectedCategory, reportId);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    if (selectedCategory && selectedReport) {
      loadReportData(selectedCategory, selectedReport, newFilters);
    }
  };

  const handleExport = async (format) => {
    if (!selectedCategory || !selectedReport || !reportData) {
      toast.error('No report selected for export');
      return;
    }

    setIsExporting(true);
    try {
      await exportReport(selectedCategory, format, reportData);
    } finally {
      setIsExporting(false);
    }
  };

  const handleRetry = () => {
    if (selectedCategory && selectedReport) {
      loadReportData(selectedCategory, selectedReport);
    }
  };

  if (error && !reportData) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports Center</h1>
          <p className="text-gray-500">Advanced analytics and reporting system</p>
        </motion.div>
        
        <Error message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports Center</h1>
        <p className="text-gray-500">Advanced analytics and reporting system for comprehensive HR insights</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-12 gap-6 h-[700px]"
      >
        {/* Left Panel - Report Categories (25%) */}
        <div className="col-span-12 lg:col-span-3">
          <ReportCategories
            categories={categories}
            selectedCategory={selectedCategory}
            selectedReport={selectedReport}
            onCategorySelect={handleCategorySelect}
            onReportSelect={handleReportSelect}
          />
        </div>

        {/* Center Panel - Report Display (50%) */}
        <div className="col-span-12 lg:col-span-6">
          <ReportDisplay
            reportData={reportData}
            reportType={selectedCategory}
            reportId={selectedReport}
            isLoading={isLoading}
          />
        </div>

        {/* Right Panel - Report Controls (25%) */}
        <div className="col-span-12 lg:col-span-3">
          <ReportControls
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            isExporting={isExporting}
            reportType={selectedCategory}
            reportId={selectedReport}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;