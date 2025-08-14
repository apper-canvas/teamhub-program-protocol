import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const ReportCategories = ({ categories, selectedCategory, selectedReport, onCategorySelect, onReportSelect }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-full">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <ApperIcon name="FolderTree" className="w-4 h-4 mr-2" />
          Report Categories
        </h3>
      </div>
      
      <div className="p-2 max-h-[600px] overflow-y-auto">
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="mb-2"
          >
            <button
              onClick={() => onCategorySelect(category.id)}
              className={cn(
                "w-full flex items-center p-3 rounded-lg text-left transition-colors",
                selectedCategory === category.id
                  ? "bg-primary-50 text-primary-700 border border-primary-200"
                  : "hover:bg-gray-50 text-gray-700"
              )}
            >
              <ApperIcon 
                name={category.icon} 
                className={cn(
                  "w-4 h-4 mr-3",
                  selectedCategory === category.id ? "text-primary-600" : "text-gray-500"
                )} 
              />
              <span className="font-medium">{category.name}</span>
              <ApperIcon 
                name={selectedCategory === category.id ? "ChevronDown" : "ChevronRight"}
                className="w-4 h-4 ml-auto"
              />
            </button>
            
            {selectedCategory === category.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-1 ml-7 space-y-1"
              >
                {category.reports.map((report, reportIndex) => (
                  <motion.button
                    key={report.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: reportIndex * 0.05 }}
                    onClick={() => onReportSelect(report.id)}
                    className={cn(
                      "w-full text-left p-2 rounded-md text-sm transition-colors",
                      selectedReport === report.id
                        ? "bg-primary-100 text-primary-800"
                        : "hover:bg-gray-50 text-gray-600"
                    )}
                  >
                    <div className="font-medium">{report.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{report.description}</div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReportCategories;