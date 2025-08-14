import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Payroll = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payroll</h1>
        <p className="text-gray-500">Manage employee compensation and benefits</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="DollarSign" className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Comprehensive payroll management including salary processing, benefits administration, tax calculations, and payslip generation will be available soon.
        </p>
      </motion.div>
    </div>
  );
};

export default Payroll;