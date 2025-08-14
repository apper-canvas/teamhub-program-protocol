import { motion } from "framer-motion";
import EmployeeCard from "@/components/molecules/EmployeeCard";
import Empty from "@/components/ui/Empty";

const EmployeeGrid = ({ employees, searchTerm }) => {
  if (employees.length === 0 && !searchTerm) {
    return (
      <Empty
        title="No employees found"
        description="There are no employees in the system yet."
        icon="Users"
      />
    );
  }

  if (employees.length === 0 && searchTerm) {
    return (
      <Empty
        title="No search results"
        description={`No employees found matching "${searchTerm}". Try a different search term.`}
        icon="Search"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {employees.map((employee, index) => (
        <motion.div
          key={employee.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <EmployeeCard employee={employee} />
        </motion.div>
      ))}
    </div>
  );
};

export default EmployeeGrid;