import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const EmployeeProfile = ({ employee }) => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "active": return "success";
      case "inactive": return "error";
      case "leave": return "warning";
      default: return "default";
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const ProfileSection = ({ title, children }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3 py-2">
      <ApperIcon name={icon} className="w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-500 w-24">{label}:</span>
      <span className="text-sm text-gray-900 font-medium">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-inner">
              {employee.photo ? (
                <img 
                  src={employee.photo} 
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <ApperIcon name="User" className="w-12 h-12 text-primary-600" />
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {employee.firstName} {employee.lastName}
                </h1>
                <p className="text-lg text-primary-600 font-medium mb-1">
                  {employee.position}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  {employee.department}
                </p>
                <Badge variant={getStatusVariant(employee.status)}>
                  {employee.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProfileSection title="Contact Information">
            <div className="space-y-1">
              <InfoRow icon="Mail" label="Email" value={employee.email} />
              <InfoRow icon="Phone" label="Phone" value={employee.phone} />
              <InfoRow icon="MapPin" label="Location" value={employee.location} />
            </div>
          </ProfileSection>
        </motion.div>

        {/* Job Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProfileSection title="Job Details">
            <div className="space-y-1">
              <InfoRow icon="Briefcase" label="Position" value={employee.position} />
              <InfoRow icon="Building2" label="Department" value={employee.department} />
              <InfoRow icon="Calendar" label="Start Date" value={formatDate(employee.startDate)} />
              <InfoRow icon="User" label="Manager" value={employee.manager} />
            </div>
          </ProfileSection>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ProfileSection title="Emergency Contact">
            <div className="space-y-1">
              <InfoRow icon="User" label="Name" value={employee.emergencyContact.name} />
              <InfoRow icon="Heart" label="Relationship" value={employee.emergencyContact.relationship} />
              <InfoRow icon="Phone" label="Phone" value={employee.emergencyContact.phone} />
            </div>
          </ProfileSection>
        </motion.div>

        {/* Employment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ProfileSection title="Employment History">
            <div className="space-y-4">
              {employee.employmentHistory.map((job, index) => (
                <div key={index} className="border-l-2 border-primary-100 pl-4">
                  <h4 className="font-medium text-gray-900">{job.position}</h4>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(job.startDate)} - {job.endDate ? formatDate(job.endDate) : "Present"}
                  </p>
                </div>
              ))}
            </div>
          </ProfileSection>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployeeProfile;