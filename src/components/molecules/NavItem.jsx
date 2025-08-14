import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavItem = ({ to, icon, children, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
          isActive
            ? "bg-primary-100 text-primary-700 shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
          className
        )
      }
    >
      {({ isActive }) => (
        <>
          <ApperIcon 
            name={icon} 
            className={cn(
              "w-5 h-5 transition-colors duration-200",
              isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-600"
            )} 
          />
          <span>{children}</span>
        </>
      )}
    </NavLink>
  );
};

export default NavItem;