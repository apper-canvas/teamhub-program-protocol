import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const EmployeeCard = ({ employee, className }) => {
  const navigate = useNavigate();

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "active": return "success";
      case "inactive": return "error";
      case "leave": return "warning";
      default: return "default";
    }
  };

  const handleCardClick = () => {
    navigate(`/employees/${employee.Id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={handleCardClick}
      className={cn(
        "bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:border-primary-200 transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start space-x-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-inner">
            {employee.photo ? (
              <img 
                src={employee.photo} 
                alt={`${employee.firstName} ${employee.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <ApperIcon name="User" className="w-8 h-8 text-primary-600" />
            )}
          </div>
          <div className="absolute -top-1 -right-1">
            <Badge variant={getStatusVariant(employee.status)} className="text-xs">
              {employee.status}
            </Badge>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="text-sm text-primary-600 font-medium mb-1">
            {employee.position}
          </p>
          <p className="text-sm text-gray-500 mb-3">
            {employee.department}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center text-xs text-gray-500">
              <ApperIcon name="Mail" className="w-3 h-3 mr-2" />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <ApperIcon name="Phone" className="w-3 h-3 mr-2" />
              <span>{employee.phone}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <ApperIcon name="MapPin" className="w-3 h-3 mr-2" />
              <span>{employee.location}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeCard;