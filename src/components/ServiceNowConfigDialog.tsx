import { useState } from "react";
import { Settings, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ServiceNowConfig } from "@/utils/ServiceNowConfig";

interface ServiceNowConfigDialogProps {
  onConfigUpdate?: () => void;
}

const ServiceNowConfigDialog = ({ onConfigUpdate }: ServiceNowConfigDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [bearerToken, setBearerToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load current configuration when dialog opens
  const handleOpen = () => {
    const currentConfig = ServiceNowConfig.getCurrentConfig();
    setBaseUrl(currentConfig.baseUrl || "");
    setBearerToken(currentConfig.bearerToken || "");
    setIsOpen(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (baseUrl && bearerToken) {
        ServiceNowConfig.saveCredentials(baseUrl, bearerToken);
        onConfigUpdate?.();
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error saving ServiceNow configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    ServiceNowConfig.clearCredentials();
    setBaseUrl("");
    setBearerToken("");
    onConfigUpdate?.();
  };

  const isConfigured = ServiceNowConfig.isConfigured();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpen}
          className="h-6 w-6 p-0 hover:bg-gray-100"
          title="Configure ServiceNow API"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-ubs-headline">ServiceNow API Configuration</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="baseUrl" className="font-frutiger font-semibold">ServiceNow Base URL</Label>
            <Input
              id="baseUrl"
              type="url"
              placeholder="https://your-instance.service-now.com"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="font-frutiger"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bearerToken" className="font-frutiger font-semibold">Bearer Token</Label>
            <div className="relative">
              <Input
                id="bearerToken"
                type={showToken ? "text" : "password"}
                placeholder="Enter your bearer token"
                value={bearerToken}
                onChange={(e) => setBearerToken(e.target.value)}
                className="font-frutiger pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={!baseUrl || !bearerToken || isLoading}
              className="flex-1 bg-ubs-red hover:bg-ubs-red-dark text-white font-frutiger font-semibold"
            >
              {isLoading ? "Saving..." : "Save Configuration"}
            </Button>
            {isConfigured && (
              <Button
                onClick={handleClear}
                variant="outline"
                className="font-frutiger font-semibold"
              >
                Clear
              </Button>
            )}
          </div>
          {isConfigured && (
            <div className="text-xs text-ubs-medium-grey font-frutiger italic">
              ✓ API is currently configured and connected
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceNowConfigDialog; 