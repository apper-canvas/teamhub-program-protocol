import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import NavItem from "@/components/molecules/NavItem";

const Sidebar = ({ onClose }) => {
  const navigationItems = [
    { name: "Dashboard", icon: "LayoutDashboard", path: "/dashboard" },
    { name: "Employees", icon: "Users", path: "/employees" },
    { name: "Departments", icon: "Building2", path: "/departments" },
    { name: "Payroll", icon: "DollarSign", path: "/payroll" },
    { name: "Time & Attendance", icon: "Clock", path: "/time-attendance" },
    { name: "Reports", icon: "BarChart3", path: "/reports" },
    { name: "Settings", icon: "Settings", path: "/settings" }
  ];

  return (
    <div className="flex h-full flex-col bg-white shadow-lg border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Users" className="w-5 h-5 text-white" />
          </div>
          <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
            TeamHub Pro
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <ApperIcon name="X" className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigationItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <NavItem to={item.path} icon={item.icon}>
              {item.name}
            </NavItem>
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">HR Manager</p>
            <p className="text-xs text-gray-500 truncate">admin@teamhub.pro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;