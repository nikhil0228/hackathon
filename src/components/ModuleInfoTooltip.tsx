
import { useState } from "react";
import { Info, X } from "lucide-react";

interface ModuleInfoTooltipProps {
  title: string;
  quickActions: string[];
}

const ModuleInfoTooltip = ({ title, quickActions }: ModuleInfoTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleInfo = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleInfo}
        className="w-5 h-5 bg-ubs-red hover:bg-ubs-red-dark text-white rounded-full flex items-center justify-center transition-colors duration-200"
        title="Module Information"
      >
        <Info className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute top-6 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-64">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
            <button
              onClick={toggleInfo}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="text-xs text-gray-600 mb-2">
            Quick Actions (red circle icons):
          </div>
          <ul className="text-xs text-gray-600 space-y-1">
            {quickActions.map((action, index) => (
              <li key={index} className="flex items-center">
                <div className="w-1 h-1 bg-ubs-red rounded-full mr-2"></div>
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ModuleInfoTooltip;
