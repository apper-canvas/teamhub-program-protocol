import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { 
  approvePayroll, 
  calculateDeductions, 
  calculateNetPay, 
  getAllPayPeriods, 
  getCurrentPayPeriod, 
  getWorkflowByPeriod, 
  importHoursFromTimeTracking, 
  processPayrollRun 
} from "@/services/api/payrollService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Employees from "@/components/pages/Employees";

const Payroll = () => {
  const [activeTab, setActiveTab] = useState('periods');
  const [payPeriods, setPayPeriods] = useState([]);
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [workflow, setWorkflow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPayrollData();
  }, []);

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      const [periodsData, currentData] = await Promise.all([
        getAllPayPeriods(),
        getCurrentPayPeriod()
      ]);
      
      setPayPeriods(periodsData);
      setCurrentPeriod(currentData);
      
      if (currentData) {
        const workflowData = await getWorkflowByPeriod(currentData.Id);
        setWorkflow(workflowData);
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessStep = async (stepType) => {
    if (!currentPeriod) return;
    
    try {
      setProcessing(true);
      let result;
      
      switch (stepType) {
        case 'import':
          result = await importHoursFromTimeTracking(currentPeriod.Id);
          toast.success('Hours imported successfully');
          break;
        case 'deductions':
          result = await calculateDeductions(currentPeriod.Id);
          toast.success('Deductions calculated');
          break;
        case 'calculations':
          result = await calculateNetPay(currentPeriod.Id);
          toast.success('Net pay calculated');
          break;
        case 'approve':
          result = await approvePayroll(currentPeriod.Id);
          toast.success('Payroll approved and processed');
          break;
        default:
          break;
      }
      
      await loadPayrollData();
    } catch (err) {
      toast.error(`Failed to ${stepType}: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'secondary';
      case 'scheduled':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getWorkflowStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPayrollData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payroll Administration</h1>
        <p className="text-gray-500">Manage payroll processing and pay periods</p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'periods', label: 'Pay Periods', icon: 'Calendar' },
              { id: 'processing', label: 'Payroll Processing', icon: 'Workflow' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'periods' && (
            <div className="space-y-6">
              {/* Current Pay Period */}
              {currentPeriod && (
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Current Pay Period</h3>
                    <Badge variant={getStatusBadgeVariant(currentPeriod.status)}>
                      {currentPeriod.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Period</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {format(parseISO(currentPeriod.payPeriodStart), 'MMM d')} - {format(parseISO(currentPeriod.payPeriodEnd), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Pay Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {format(parseISO(currentPeriod.payDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Net Pay</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(currentPeriod.totalNet)}
                      </p>
                    </div>
                  </div>

                  {currentPeriod.status === 'processing' && (
                    <div className="mt-4 flex space-x-3">
                      <Button
                        onClick={() => handleProcessStep('approve')}
                        disabled={processing}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processing ? (
                          <>
                            <ApperIcon name="Loader2" className="animate-spin mr-2" size={16} />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ApperIcon name="Check" className="mr-2" size={16} />
                            Approve Payroll
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Pay Period History */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll History</h3>
                <div className="space-y-3">
                  {payPeriods.slice(0, 5).map((period) => (
                    <motion.div
                      key={period.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          period.status === 'completed' ? 'bg-green-100' : 'bg-gray-200'
                        }`}>
                          <ApperIcon
                            name={period.status === 'completed' ? 'CheckCircle' : 'Clock'}
                            className={period.status === 'completed' ? 'text-green-600' : 'text-gray-500'}
                            size={20}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {format(parseISO(period.payPeriodStart), 'MMM d')} - {format(parseISO(period.payPeriodEnd), 'MMM d, yyyy')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {period.employeeCount} employees • {period.hoursProcessed} hours
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(period.totalNet)}</p>
                        <p className="text-sm text-gray-500">{format(parseISO(period.payDate), 'MMM d')}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Next Scheduled Run */}
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ApperIcon name="Calendar" className="text-blue-600" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900">Next Scheduled Run</h3>
                </div>
                
                {payPeriods.find(p => p.status === 'scheduled') ? (
                  <div className="space-y-3">
                    {(() => {
                      const nextRun = payPeriods.find(p => p.status === 'scheduled');
                      return (
                        <>
                          <p className="text-gray-700">
                            <span className="font-medium">Period:</span> {format(parseISO(nextRun.payPeriodStart), 'MMM d')} - {format(parseISO(nextRun.payPeriodEnd), 'MMM d, yyyy')}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-medium">Pay Date:</span> {format(parseISO(nextRun.payDate), 'MMM d, yyyy')}
                          </p>
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Pre-processing Checklist:</p>
                            <ul className="space-y-1 text-sm text-gray-600">
                              <li className="flex items-center space-x-2">
                                <ApperIcon name="Check" className="text-green-500" size={16} />
                                <span>Employee data verified</span>
                              </li>
                              <li className="flex items-center space-x-2">
                                <ApperIcon name="Check" className="text-green-500" size={16} />
                                <span>Tax rates updated</span>
                              </li>
                              <li className="flex items-center space-x-2">
                                <ApperIcon name="Clock" className="text-yellow-500" size={16} />
                                <span>Time tracking data pending</span>
                              </li>
                            </ul>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <p className="text-gray-600">No scheduled payroll runs</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'processing' && (
            <div className="space-y-6">
              {currentPeriod ? (
                <>
                  {/* Processing Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Processing: {format(parseISO(currentPeriod.payPeriodStart), 'MMM d')} - {format(parseISO(currentPeriod.payPeriodEnd), 'MMM d, yyyy')}
                      </h3>
                      <p className="text-gray-500">Follow the workflow to complete payroll processing</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(currentPeriod.status)}>
                      {currentPeriod.status}
                    </Badge>
                  </div>

                  {/* Workflow Steps */}
                  <div className="space-y-4">
                    {workflow.map((step, index) => (
                      <motion.div
                        key={step.Id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`border rounded-lg p-6 ${
                          step.status === 'completed'
                            ? 'border-green-200 bg-green-50'
                            : step.status === 'pending'
                            ? 'border-yellow-200 bg-yellow-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              step.status === 'completed'
                                ? 'bg-green-100'
                                : step.status === 'pending'
                                ? 'bg-yellow-100'
                                : 'bg-gray-100'
                            }`}>
                              <ApperIcon
                                name={getWorkflowStatusIcon(step.status)}
                                className={
                                  step.status === 'completed'
                                    ? 'text-green-600'
                                    : step.status === 'pending'
                                    ? 'text-yellow-600'
                                    : 'text-gray-500'
                                }
                                size={20}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{step.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                              
                              {step.status === 'completed' && step.completedAt && (
                                <p className="text-xs text-gray-500 mt-2">
                                  Completed {format(parseISO(step.completedAt), 'MMM d, yyyy h:mm a')} by {step.completedBy}
                                </p>
                              )}

                              {step.data && step.status === 'completed' && (
                                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  {Object.entries(step.data).map(([key, value]) => (
                                    <div key={key}>
                                      <p className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                                      <p className="font-medium">
                                        {typeof value === 'number' && key.toLowerCase().includes('tax') || key.toLowerCase().includes('total') ? 
                                          formatCurrency(value) : value}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {step.status === 'pending' && (
                            <Button
                              onClick={() => handleProcessStep(step.step === 'hours_import' ? 'import' : step.step)}
                              disabled={processing}
                              size="sm"
                              className="ml-4"
                            >
                              {processing ? (
                                <ApperIcon name="Loader2" className="animate-spin" size={16} />
                              ) : (
                                <>Process</>
                              )}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Summary */}
                  {currentPeriod.status === 'processing' && (
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-4">Processing Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-gray-500">Total Gross Pay</p>
                          <p className="text-lg font-semibold text-gray-900">{formatCurrency(currentPeriod.totalGross)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Net Pay</p>
                          <p className="text-lg font-semibold text-green-600">{formatCurrency(currentPeriod.totalNet)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Employees</p>
                          <p className="text-lg font-semibold text-gray-900">{currentPeriod.employeeCount}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="Workflow" className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Processing</h3>
                  <p className="text-gray-500">There are no payroll runs currently being processed.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Payroll;