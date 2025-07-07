
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Package, Send, User, AlertCircle } from "lucide-react";
import ModuleInfoTooltip from "./ModuleInfoTooltip";

const ResourceRequest = () => {
  const [requestType, setRequestType] = useState("");
  const [description, setDescription] = useState("");
  const [justification, setJustification] = useState("");
  const [urgency, setUrgency] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");

  const handleSubmitRequest = () => {
    const request = {
      type: requestType,
      description,
      justification,
      urgency,
      estimatedCost,
      timestamp: new Date().toISOString(),
      status: "Pending Manager Approval"
    };
    
    console.log("Resource request submitted:", request);
    
    // Reset form
    setRequestType("");
    setDescription("");
    setJustification("");
    setUrgency("");
    setEstimatedCost("");
    
    // Show success message (in real app, this would be a toast)
    alert("Request submitted successfully! Your manager will be notified for approval.");
  };

  const quickActions = [
    "Submit Request - Send resource request to manager",
    "BBS Portal - Access BBS resource portal",
    "Agnes Portal - Access Agnes procurement system",
    "Track Requests - View submitted request status"
  ];

  return (
    <Card className="h-full border-green-100">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-green-600 flex items-center gap-2">
            <Package className="h-5 w-5" />
            Resource Request
          </CardTitle>
          <ModuleInfoTooltip title="Resource Management" quickActions={quickActions} />
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-5rem)] overflow-y-auto">
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Manager Approval Required</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Resource requests will be sent to your manager for approval before processing through BBS/Agnes portals.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Request Type</label>
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hardware">Hardware Equipment</SelectItem>
                  <SelectItem value="software">Software License</SelectItem>
                  <SelectItem value="access">System Access</SelectItem>
                  <SelectItem value="training">Training/Certification</SelectItem>
                  <SelectItem value="other">Other Resource</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
              <Textarea
                placeholder="Describe the resource you need..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-20 resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Business Justification</label>
              <Textarea
                placeholder="Explain why this resource is needed..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="h-20 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Urgency</label>
                <Select value={urgency} onValueChange={setUrgency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Estimated Cost</label>
                <Input
                  placeholder="$0.00"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={handleSubmitRequest}
              disabled={!requestType || !description || !justification}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Request for Approval
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceRequest;
