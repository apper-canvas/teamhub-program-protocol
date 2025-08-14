import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import EmployeeCard from "@/components/molecules/EmployeeCard";
import { getEmployeesByDepartment } from "@/services/api/employeeService";
import { cn } from "@/utils/cn";

// Mock department data with hierarchical structure
const mockDepartments = [
  {
    Id: 1,
    name: "Engineering",
    manager: "John Smith",
    managerPhoto: "",
    employeeCount: 15,
    budget: 2500000,
    budgetUtilization: 85,
    description: "Responsible for product development, infrastructure, and technical innovation.",
    goals: ["Deliver high-quality software", "Maintain 99.9% uptime", "Implement CI/CD pipeline"],
    children: [
      {
        Id: 2,
        name: "Frontend Development",
        manager: "Sarah Johnson",
        managerPhoto: "",
        employeeCount: 6,
        budget: 900000,
        budgetUtilization: 78,
        description: "User interface and user experience development.",
        goals: ["Improve page load times", "Enhance mobile responsiveness"],
        children: []
      },
      {
        Id: 3,
        name: "Backend Development",
        manager: "Alex Kim",
        managerPhoto: "",
        employeeCount: 5,
        budget: 850000,
        budgetUtilization: 92,
        description: "Server-side development and API management.",
        goals: ["Scale microservices", "Optimize database performance"],
        children: []
      },
      {
        Id: 4,
        name: "DevOps",
        manager: "Chris Wilson",
        managerPhoto: "",
        employeeCount: 4,
        budget: 750000,
        budgetUtilization: 88,
        description: "Infrastructure, deployment, and monitoring.",
        goals: ["Automate deployment pipeline", "Reduce deployment time"],
        children: []
      }
    ]
  },
  {
    Id: 5,
    name: "Product",
    manager: "Lisa Davis",
    managerPhoto: "",
    employeeCount: 8,
    budget: 1200000,
    budgetUtilization: 73,
    description: "Product strategy, roadmap planning, and user research.",
    goals: ["Launch 3 major features", "Increase user satisfaction by 15%"],
    children: [
      {
        Id: 6,
        name: "Product Management",
        manager: "Michael Chen",
        managerPhoto: "",
        employeeCount: 4,
        budget: 600000,
        budgetUtilization: 80,
        description: "Feature planning and product strategy.",
        goals: ["Define product roadmap", "Conduct user interviews"],
        children: []
      },
      {
        Id: 7,
        name: "User Research",
        manager: "Emily Rodriguez",
        managerPhoto: "",
        employeeCount: 4,
        budget: 600000,
        budgetUtilization: 65,
        description: "User behavior analysis and market research.",
        goals: ["Complete quarterly user study", "Improve user onboarding"],
        children: []
      }
    ]
  },
  {
    Id: 8,
    name: "Design",
    manager: "David Wilson",
    managerPhoto: "",
    employeeCount: 6,
    budget: 720000,
    budgetUtilization: 70,
    description: "User experience and visual design for all products.",
    goals: ["Redesign mobile app", "Create design system v2.0"],
    children: []
  },
  {
    Id: 9,
    name: "Marketing",
    manager: "Jennifer Lee",
    managerPhoto: "",
    employeeCount: 10,
    budget: 1500000,
    budgetUtilization: 82,
    description: "Brand management, digital marketing, and growth strategies.",
    goals: ["Increase brand awareness by 25%", "Launch new campaign"],
    children: [
      {
        Id: 10,
        name: "Digital Marketing",
        manager: "David Thompson",
        managerPhoto: "",
        employeeCount: 6,
        budget: 900000,
        budgetUtilization: 85,
        description: "Online advertising and social media marketing.",
        goals: ["Improve conversion rates", "Expand social media reach"],
        children: []
      },
      {
        Id: 11,
        name: "Content Marketing",
        manager: "Maria Garcia",
        managerPhoto: "",
        employeeCount: 4,
        budget: 600000,
        budgetUtilization: 78,
        description: "Content creation and marketing materials.",
        goals: ["Publish 50 blog posts", "Create video content"],
        children: []
      }
    ]
  },
  {
    Id: 12,
    name: "Sales",
    manager: "Patricia Martinez",
    managerPhoto: "",
    employeeCount: 12,
    budget: 1800000,
    budgetUtilization: 90,
    description: "Revenue generation and customer acquisition.",
    goals: ["Achieve 120% of sales target", "Expand enterprise accounts"],
    children: []
  },
  {
    Id: 13,
    name: "Human Resources",
    manager: "Amanda Taylor",
    managerPhoto: "",
    employeeCount: 5,
    budget: 600000,
    budgetUtilization: 68,
    description: "Talent acquisition, employee development, and company culture.",
    goals: ["Hire 20 new employees", "Implement new performance review system"],
    children: []
  },
  {
    Id: 14,
    name: "Finance",
    manager: "Kevin Johnson",
    managerPhoto: "",
    employeeCount: 7,
    budget: 800000,
    budgetUtilization: 75,
    description: "Financial planning, accounting, and business operations.",
    goals: ["Reduce operational costs by 10%", "Implement new ERP system"],
    children: []
  }
];

const DepartmentNode = ({ department, level = 0, selectedId, onSelect, expandedIds, onToggleExpand }) => {
  const hasChildren = department.children && department.children.length > 0;
  const isExpanded = expandedIds.includes(department.Id);
  const isSelected = selectedId === department.Id;

  const getBudgetColor = (utilization) => {
    if (utilization >= 90) return "text-error-500";
    if (utilization >= 80) return "text-warning-500";
    return "text-success-500";
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors group",
          isSelected ? "bg-primary-50 border border-primary-200" : "hover:bg-gray-50",
          level > 0 && "ml-4 border-l border-gray-200 pl-4"
        )}
        onClick={() => onSelect(department)}
      >
        {hasChildren && (
          <button
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(department.Id);
            }}
          >
            <ApperIcon 
              name={isExpanded ? "ChevronDown" : "ChevronRight"} 
              size={16} 
              className="text-gray-500" 
            />
          </button>
        )}
        {!hasChildren && <div className="w-6" />}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "font-medium text-sm truncate",
              isSelected ? "text-primary-700" : "text-gray-900"
            )}>
              {department.name}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {department.employeeCount}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 truncate">{department.manager}</p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-12 bg-gray-200 rounded-full h-1">
              <div 
                className={cn("h-1 rounded-full", getBudgetColor(department.budgetUtilization))}
                style={{ width: `${Math.min(department.budgetUtilization, 100)}%` }}
              />
            </div>
            <span className={cn("text-xs", getBudgetColor(department.budgetUtilization))}>
              {department.budgetUtilization}%
            </span>
          </div>
        </div>
      </div>
      
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {department.children.map((child) => (
            <DepartmentNode
              key={child.Id}
              department={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DepartmentDetails = ({ department, employees, onAddEmployee, onEditDepartment, onViewReports }) => {
  if (!department) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <ApperIcon name="Building2" size={48} className="mx-auto mb-4 text-gray-300" />
          <p>Select a department to view details</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const avgSalary = employees.length > 0 ? Math.round(department.budget / employees.length) : 0;

  return (
    <div className="space-y-6">
      {/* Department Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{department.name}</h2>
            <p className="text-gray-600">{department.description}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <ApperIcon name="User" size={16} />
            <span>{department.manager}</span>
          </div>
        </div>
        
        {department.goals && department.goals.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Current Goals</h4>
            <ul className="space-y-1">
              {department.goals.map((goal, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <ApperIcon name="Target" size={14} className="text-primary-500" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Department Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Team Size</p>
              <p className="text-xl font-semibold text-gray-900">{department.employeeCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={20} className="text-success-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Budget Utilization</p>
              <p className="text-xl font-semibold text-gray-900">{department.budgetUtilization}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={20} className="text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Salary</p>
              <p className="text-xl font-semibold text-gray-900">{formatCurrency(avgSalary)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button onClick={onAddEmployee} className="flex items-center gap-2">
            <ApperIcon name="UserPlus" size={16} />
            Add Employee
          </Button>
          <Button variant="outline" onClick={onEditDepartment} className="flex items-center gap-2">
            <ApperIcon name="Edit" size={16} />
            Edit Department
          </Button>
          <Button variant="outline" onClick={onViewReports} className="flex items-center gap-2">
            <ApperIcon name="FileText" size={16} />
            View Reports
          </Button>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-medium text-gray-900 mb-4">Team Members ({employees.length})</h3>
        {employees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((employee) => (
              <EmployeeCard key={employee.Id} employee={employee} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="Users" size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No team members found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Departments = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [expandedIds, setExpandedIds] = useState([1, 5, 9]); // Initially expand some departments
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDepartment) {
      loadDepartmentEmployees(selectedDepartment.name);
    }
  }, [selectedDepartment]);

  const loadDepartmentEmployees = async (departmentName) => {
    setLoading(true);
    try {
      const departmentEmployees = await getEmployeesByDepartment(departmentName);
      setEmployees(departmentEmployees);
    } catch (error) {
      console.error('Failed to load department employees:', error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDepartment = (department) => {
    setSelectedDepartment(department);
  };

  const handleToggleExpand = (departmentId) => {
    setExpandedIds(prev => 
      prev.includes(departmentId)
        ? prev.filter(id => id !== departmentId)
        : [...prev, departmentId]
    );
  };

  const handleAddEmployee = () => {
    // Navigate to add employee with department pre-selected
    console.log('Add employee to department:', selectedDepartment?.name);
  };

  const handleEditDepartment = () => {
    console.log('Edit department:', selectedDepartment?.name);
  };

  const handleViewReports = () => {
    console.log('View reports for department:', selectedDepartment?.name);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Departments</h1>
        <p className="text-gray-500">Manage organizational structure and departments</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-12 gap-6 min-h-[700px]"
      >
        {/* Left Panel - Department Tree */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-medium text-gray-900">Organization Structure</h2>
            </div>
            <div className="p-2 max-h-[600px] overflow-y-auto">
              {mockDepartments.map((department) => (
                <DepartmentNode
                  key={department.Id}
                  department={department}
                  selectedId={selectedDepartment?.Id}
                  onSelect={handleSelectDepartment}
                  expandedIds={expandedIds}
                  onToggleExpand={handleToggleExpand}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Department Details */}
        <div className="col-span-12 lg:col-span-8">
          <DepartmentDetails
            department={selectedDepartment}
            employees={employees}
            onAddEmployee={handleAddEmployee}
            onEditDepartment={handleEditDepartment}
            onViewReports={handleViewReports}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Departments;