import employeesData from "../mockData/employees.json";

// Get employees by department
export const getEmployeesByDepartment = async (departmentName) => {
  // Simulate API delay
  await delay(500);
  
  if (!departmentName) {
    throw new Error('Department name is required');
  }
  
  // Filter employees by department name
  const departmentEmployees = [...employeesData].filter(employee => 
    employee.department.toLowerCase() === departmentName.toLowerCase()
  );
  
  return departmentEmployees;
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get all employees
export const getAllEmployees = async () => {
  await delay(300);
  return [...employeesData];
};

// Get employee by ID
export const getEmployeeById = async (id) => {
  await delay(200);
  const employee = employeesData.find(emp => emp.Id === id);
  return employee ? { ...employee } : null;
};

// Create new employee
export const createEmployee = async (employeeData) => {
  await delay(400);
  const maxId = Math.max(...employeesData.map(emp => emp.Id));
  const newEmployee = {
    ...employeeData,
    Id: maxId + 1
  };
  employeesData.push(newEmployee);
  return { ...newEmployee };
};

// Update employee
export const updateEmployee = async (id, updates) => {
  await delay(350);
  const index = employeesData.findIndex(emp => emp.Id === id);
  if (index === -1) return null;
  
  employeesData[index] = { ...employeesData[index], ...updates };
  return { ...employeesData[index] };
};

// Delete employee
export const deleteEmployee = async (id) => {
  await delay(250);
  const index = employeesData.findIndex(emp => emp.Id === id);
  if (index === -1) return false;
  
  employeesData.splice(index, 1);
  return true;
};