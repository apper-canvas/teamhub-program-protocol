import { Link, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Breadcrumb = ({ className }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbNames = {
    "dashboard": "Dashboard",
    "employees": "Employees",
    "departments": "Departments",
    "payroll": "Payroll",
    "time-attendance": "Time & Attendance",
    "reports": "Reports",
    "settings": "Settings"
  };

  if (pathnames.length === 0) return null;

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-gray-500", className)}>
      <Link 
        to="/dashboard" 
        className="hover:text-primary-500 transition-colors duration-200 font-medium"
      >
        Dashboard
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        
        if (name === "dashboard") return null;

        return (
          <div key={name} className="flex items-center space-x-1">
            <ApperIcon name="ChevronRight" className="h-4 w-4" />
            {isLast ? (
              <span className="text-gray-900 font-medium">
                {breadcrumbNames[name] || name}
              </span>
            ) : (
              <Link 
                to={routeTo} 
                className="hover:text-primary-500 transition-colors duration-200 font-medium"
              >
                {breadcrumbNames[name] || name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;