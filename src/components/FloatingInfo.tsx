
import { useState } from "react";
import { Info, X } from "lucide-react";

const FloatingInfo = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleInfo = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleInfo}
        className="fixed bottom-6 right-6 w-14 h-14 bg-ubs-red hover:bg-ubs-red-dark text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 animate-float z-40"
        aria-label="Information"
      >
        <Info className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={toggleInfo}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 font-helvetica mb-2">
                About PAL Dashboard
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Personal Assistant Lite (PAL) is your centralized dashboard for managing work tasks and communications efficiently.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Quick Actions</h4>
                <p className="text-xs text-gray-600">
                  Each module provides quick action buttons (red circles with white icons) for immediate task management.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Real-time Updates</h4>
                <p className="text-xs text-gray-600">
                  The dashboard automatically refreshes to show your latest emails, tickets, issues, and meetings.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Global Search</h4>
                <p className="text-xs text-gray-600">
                  Use the search bar in the header to quickly find information across all integrated services.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className="text-xs text-gray-500">Version 1.0 • UBS Technology</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingInfo;
