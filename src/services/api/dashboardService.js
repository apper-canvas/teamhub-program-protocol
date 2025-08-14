import metricsData from "../mockData/metrics.json";
import activitiesData from "../mockData/activities.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Get dashboard metrics
export const getDashboardMetrics = async () => {
  await delay(300);
  return [...metricsData];
};

// Get recent activity
export const getRecentActivity = async () => {
  await delay(200);
  return [...activitiesData];
};