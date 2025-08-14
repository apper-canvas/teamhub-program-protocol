import payrollData from '../mockData/payrollData.json';
import payrollRuns from '../mockData/payrollRuns.json';
import payrollWorkflow from '../mockData/payrollWorkflow.json';

// Mock delay to simulate API calls
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage (simulates database)
let payPeriods = [...payrollData];
let runs = [...payrollRuns];
let workflow = [...payrollWorkflow];

// Pay Periods CRUD Operations
export const getAllPayPeriods = async () => {
  await delay(300);
  return [...payPeriods].sort((a, b) => new Date(b.payPeriodStart) - new Date(a.payPeriodStart));
};

export const getPayPeriodById = async (id) => {
  await delay(200);
  const payPeriod = payPeriods.find(p => p.Id === parseInt(id));
  if (!payPeriod) {
    throw new Error(`Pay period with ID ${id} not found`);
  }
  return { ...payPeriod };
};

export const getCurrentPayPeriod = async () => {
  await delay(200);
  const now = new Date();
  const current = payPeriods.find(p => {
    const start = new Date(p.payPeriodStart);
    const end = new Date(p.payPeriodEnd);
    return now >= start && now <= end;
  });
  return current ? { ...current } : payPeriods.find(p => p.status === 'processing');
};

export const createPayPeriod = async (data) => {
  await delay(400);
  const newId = Math.max(...payPeriods.map(p => p.Id)) + 1;
  const newPayPeriod = {
    Id: newId,
    payPeriodStart: data.payPeriodStart,
    payPeriodEnd: data.payPeriodEnd,
    payDate: data.payDate,
    status: 'scheduled',
    totalGross: 0,
    totalNet: 0,
    employeeCount: data.employeeCount || 0,
    hoursProcessed: 0,
    processedBy: null,
    processedDate: null
  };
  payPeriods.push(newPayPeriod);
  return { ...newPayPeriod };
};

export const updatePayPeriod = async (id, data) => {
  await delay(300);
  const index = payPeriods.findIndex(p => p.Id === parseInt(id));
  if (index === -1) {
    throw new Error(`Pay period with ID ${id} not found`);
  }
  payPeriods[index] = { ...payPeriods[index], ...data };
  return { ...payPeriods[index] };
};

// Payroll Runs Operations
export const getPayrollRunsByPeriod = async (payPeriodId) => {
  await delay(300);
  return runs.filter(r => r.payPeriodId === parseInt(payPeriodId));
};

export const processPayrollRun = async (payPeriodId) => {
  await delay(2000); // Simulate processing time
  const payPeriod = payPeriods.find(p => p.Id === parseInt(payPeriodId));
  if (!payPeriod) {
    throw new Error(`Pay period with ID ${payPeriodId} not found`);
  }
  
  // Update pay period status
  payPeriod.status = 'processing';
  payPeriod.processedDate = new Date().toISOString();
  
  return { success: true, message: 'Payroll processing initiated' };
};

// Workflow Operations
export const getWorkflowByPeriod = async (payPeriodId) => {
  await delay(200);
  return workflow.filter(w => w.payPeriodId === parseInt(payPeriodId));
};

export const updateWorkflowStep = async (stepId, status, data = {}) => {
  await delay(300);
  const index = workflow.findIndex(w => w.Id === parseInt(stepId));
  if (index === -1) {
    throw new Error(`Workflow step with ID ${stepId} not found`);
  }
  
  workflow[index] = {
    ...workflow[index],
    status,
    completedAt: status === 'completed' ? new Date().toISOString() : null,
    completedBy: status === 'completed' ? 'HR Manager' : null,
    data: { ...workflow[index].data, ...data }
  };
  
  return { ...workflow[index] };
};

export const approvePayroll = async (payPeriodId) => {
  await delay(1000);
  const payPeriod = payPeriods.find(p => p.Id === parseInt(payPeriodId));
  if (!payPeriod) {
    throw new Error(`Pay period with ID ${payPeriodId} not found`);
  }
  
  // Update pay period to completed
  payPeriod.status = 'completed';
  payPeriod.processedBy = 'HR Manager';
  
  // Update approval workflow step
  const approvalStep = workflow.find(w => w.payPeriodId === parseInt(payPeriodId) && w.step === 'approval');
  if (approvalStep) {
    approvalStep.status = 'completed';
    approvalStep.completedAt = new Date().toISOString();
    approvalStep.completedBy = 'HR Manager';
  }
  
  return { success: true, message: 'Payroll approved and processed' };
};

// Import Hours from Time Tracking
export const importHoursFromTimeTracking = async (payPeriodId) => {
  await delay(1500);
  
  // Simulate importing hours data
  const hoursData = {
    totalHours: 970,
    regularHours: 940,
    overtimeHours: 30,
    employeesProcessed: 12
  };
  
  // Update workflow step
  const hoursStep = workflow.find(w => w.payPeriodId === parseInt(payPeriodId) && w.step === 'hours_import');
  if (hoursStep) {
    hoursStep.status = 'completed';
    hoursStep.completedAt = new Date().toISOString();
    hoursStep.completedBy = 'System';
    hoursStep.data = hoursData;
  }
  
  return { success: true, data: hoursData };
};

// Calculate Deductions
export const calculateDeductions = async (payPeriodId) => {
  await delay(1200);
  
  const deductionsData = {
    federalTax: 13200.00,
    stateTax: 4400.00,
    socialSecurity: 5480.80,
    medicare: 1281.60,
    benefits: 4200.00
  };
  
  // Update workflow step
  const deductionsStep = workflow.find(w => w.payPeriodId === parseInt(payPeriodId) && w.step === 'deductions');
  if (deductionsStep) {
    deductionsStep.status = 'completed';
    deductionsStep.completedAt = new Date().toISOString();
    deductionsStep.completedBy = 'HR Manager';
    deductionsStep.data = deductionsData;
  }
  
  return { success: true, data: deductionsData };
};

// Calculate Net Pay
export const calculateNetPay = async (payPeriodId) => {
  await delay(1000);
  
  const calculationsData = {
    totalGross: 88400.00,
    totalDeductions: 22480.00,
    totalNet: 65920.00
  };
  
  // Update workflow step
  const calcStep = workflow.find(w => w.payPeriodId === parseInt(payPeriodId) && w.step === 'calculations');
  if (calcStep) {
    calcStep.status = 'completed';
    calcStep.completedAt = new Date().toISOString();
    calcStep.completedBy = 'HR Manager';
    calcStep.data = calculationsData;
  }
  
  // Update pay period totals
  const payPeriod = payPeriods.find(p => p.Id === parseInt(payPeriodId));
  if (payPeriod) {
    payPeriod.totalGross = calculationsData.totalGross;
    payPeriod.totalNet = calculationsData.totalNet;
    payPeriod.hoursProcessed = 970;
  }
  
  return { success: true, data: calculationsData };
};