import { Info, X, Maximize } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onClose?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
}

const Header = ({ onClose, onMaximize, isMaximized }: HeaderProps) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const toggleInfo = () => {
    setIsInfoOpen(!isInfoOpen);
  };

  return (
    <>
      <header className="bg-white text-[hsl(var(--ubs-dark-grey))] px-6 py-4 flex items-center justify-between shadow-sm font-frutiger font-light" style={{ fontWeight: 300 }}>
        <div className="flex items-center">
          <img src="/UBSLOGO.png" alt="UBS Logo" className="h-8 w-auto mr-3" />
          <div className="text-xl font-bold font-frutiger tracking-wide text-[hsl(var(--ubs-dark-grey))]" style={{ fontWeight: 300 }}>
            
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={toggleInfo}
            variant="ghost"
            size="icon"
            aria-label="Information"
            className="w-8 h-8"
          >
            <Info className="h-5 w-5 text-[hsl(var(--ubs-dark-grey))]" />
          </Button>
          {onMaximize && (
            <Button
              onClick={onMaximize}
              variant="ghost"
              size="icon"
              aria-label={isMaximized ? "Minimize" : "Maximize"}
              className="w-8 h-8"
            >
              <Maximize className="h-5 w-5 text-[hsl(var(--ubs-dark-grey))]" />
            </Button>
          )}
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              aria-label="Close PAL"
              className="w-8 h-8"
            >
              <X className="h-5 w-5 text-[hsl(var(--ubs-dark-grey))]" />
            </Button>
          )}
        </div>
      </header>

      {isInfoOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={toggleInfo}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-ubs-black font-ubs-headline mb-2">
                About PAL Dashboard
              </h3>
              <p className="text-sm text-ubs-black mb-4 font-frutiger">
                Personal Assistant Lite (PAL) is your centralized dashboard for managing work tasks and communications efficiently.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-ubs-black text-sm font-frutiger font-semibold">Quick Actions</h4>
                <p className="text-xs text-ubs-medium-grey font-frutiger">
                  Each module provides quick action buttons (red circles with white icons) for immediate task management.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-ubs-black text-sm font-frutiger font-semibold">Real-time Updates</h4>
                <p className="text-xs text-ubs-medium-grey font-frutiger">
                  The dashboard automatically refreshes to show your latest emails, tickets, issues, and meetings.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-ubs-black text-sm font-frutiger font-semibold">Global Search</h4>
                <p className="text-xs text-ubs-medium-grey font-frutiger">
                  Use the search bar in the header to quickly find information across all integrated services.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-ubs-black text-sm font-frutiger font-semibold">AI Assistant</h4>
                <p className="text-xs text-ubs-medium-grey font-frutiger">
                  Use the voice assistant to ask questions about your work data and get instant responses.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className="text-xs text-ubs-medium-grey font-frutiger italic">Version 1.0 • UBS Technology</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
