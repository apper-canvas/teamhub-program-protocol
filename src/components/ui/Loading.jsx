import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const LoadingSkeleton = ({ className, variant = "default" }) => {
  const variants = {
    default: "h-4 bg-gray-200 rounded animate-pulse",
    card: "h-64 bg-gray-200 rounded-xl animate-pulse",
    avatar: "h-16 w-16 bg-gray-200 rounded-full animate-pulse",
    text: "h-4 bg-gray-200 rounded animate-pulse",
    title: "h-6 bg-gray-200 rounded animate-pulse"
  };

  return <div className={cn(variants[variant], className)} />;
};

const Loading = ({ type = "default", className }) => {
  if (type === "employees") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start space-x-4">
              <LoadingSkeleton variant="avatar" />
              <div className="flex-1 space-y-3">
                <LoadingSkeleton variant="title" className="w-32" />
                <LoadingSkeleton variant="text" className="w-24" />
                <LoadingSkeleton variant="text" className="w-20" />
                <div className="space-y-2">
                  <LoadingSkeleton variant="text" className="w-full" />
                  <LoadingSkeleton variant="text" className="w-28" />
                  <LoadingSkeleton variant="text" className="w-32" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "metrics") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <LoadingSkeleton className="w-12 h-12 rounded-lg" />
              <LoadingSkeleton className="w-16 h-4" />
            </div>
            <LoadingSkeleton variant="title" className="w-16 mb-2" />
            <LoadingSkeleton variant="text" className="w-24" />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center py-12", className)}>
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;