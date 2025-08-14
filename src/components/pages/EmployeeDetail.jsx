import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import EmployeeProfile from "@/components/organisms/EmployeeProfile";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { getEmployeeById } from "@/services/api/employeeService";
import { toast } from "react-toastify";

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEmployee = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getEmployeeById(parseInt(id));
      if (!data) {
        setError("Employee not found.");
        return;
      }
      setEmployee(data);
    } catch (err) {
      setError("Failed to load employee details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const handleBack = () => {
    navigate("/employees");
  };

  const handleEdit = () => {
    toast.info("Edit functionality coming soon!");
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button onClick={handleBack} variant="ghost" className="inline-flex items-center">
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to Employees
          </Button>
        </div>
        <Error message={error} onRetry={loadEmployee} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Button onClick={handleBack} variant="ghost" className="inline-flex items-center">
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to Employees
        </Button>
        <Button onClick={handleEdit} className="inline-flex items-center">
          <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
          Edit Employee
        </Button>
      </motion.div>

      {/* Employee Profile */}
      <EmployeeProfile employee={employee} />
    </div>
  );
};

export default EmployeeDetail;