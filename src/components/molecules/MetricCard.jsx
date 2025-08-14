import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon, 
  className,
  gradient = "from-primary-500 to-primary-600"
}) => {
  const getTrendColor = (trend) => {
    switch (trend) {
      case "up": return "text-success-500";
      case "down": return "text-error-500";
      default: return "text-gray-500";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up": return "TrendingUp";
      case "down": return "TrendingDown";
      default: return "Minus";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center shadow-lg`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
        {change !== undefined && (
          <div className={cn("flex items-center text-sm font-medium", getTrendColor(trend))}>
            <ApperIcon name={getTrendIcon(trend)} className="w-4 h-4 mr-1" />
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
      </div>
    </motion.div>
  );
};

export default MetricCard;