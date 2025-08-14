import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import EmployeeGrid from "@/components/organisms/EmployeeGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { getAllEmployees } from "@/services/api/employeeService";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    
    const term = searchTerm.toLowerCase();
    return employees.filter(employee =>
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(term) ||
      employee.position.toLowerCase().includes(term) ||
      employee.department.toLowerCase().includes(term) ||
      employee.email.toLowerCase().includes(term)
    );
  }, [employees, searchTerm]);

  if (loading) {
    return <Loading type="employees" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadEmployees} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500 mt-1">
            Manage and view employee information
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <SearchBar
            placeholder="Search employees..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-full sm:w-80"
          />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Users" className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">Total Employees:</span>
              <span className="text-sm font-semibold text-gray-900">{employees.length}</span>
            </div>
            {searchTerm && (
              <div className="flex items-center space-x-2">
                <ApperIcon name="Search" className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Found:</span>
                <span className="text-sm font-semibold text-primary-600">{filteredEmployees.length}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Employee Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <EmployeeGrid employees={filteredEmployees} searchTerm={searchTerm} />
      </motion.div>
    </div>
  );
};

export default Employees;