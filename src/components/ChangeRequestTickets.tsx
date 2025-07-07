
import { GitBranch, Eye, CheckCircle, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActionButton from "./ActionButton";
import ModuleInfoTooltip from "./ModuleInfoTooltip";

interface ChangeRequest {
  ticketId: string;
  shortDescription: string;
  priority: string;
  status: string;
  changeWindow: string;
  riskLevel: string;
  approver: string;
  createdDate: string;
}

const ChangeRequestTickets = () => {
  const changeRequests: ChangeRequest[] = [
    {
      ticketId: "CHG0078901",
      shortDescription: "Database server maintenance and upgrade",
      priority: "High",
      status: "Pending CAB Approval",
      changeWindow: "Dec 28, 2024 10:00 PM - 2:00 AM",
      riskLevel: "Medium",
      approver: "Change Advisory Board",
      createdDate: "3 days ago"
    },
    {
      ticketId: "CHG0078902",
      shortDescription: "Network infrastructure configuration update",
      priority: "Medium",
      status: "Scheduled",
      changeWindow: "Dec 30, 2024 6:00 PM - 8:00 PM",
      riskLevel: "Low",
      approver: "Network Team Lead",
      createdDate: "1 week ago"
    },
    {
      ticketId: "CHG0078903",
      shortDescription: "Security patch deployment across all servers",
      priority: "Critical",
      status: "In Review",
      changeWindow: "Dec 29, 2024 12:00 AM - 4:00 AM",
      riskLevel: "High",
      approver: "Security Team",
      createdDate: "2 days ago"
    }
  ];

  const quickActions = [
    "Review Change - Review change details and impact",
    "Approve/Reject - Approve or reject change request",
    "Schedule Change - Set implementation schedule",
    "View Risk Assessment - See risk analysis"
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "text-red-600";
      case "High": return "text-orange-600";
      case "Medium": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High": return "text-red-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <GitBranch className="h-5 w-5 text-purple-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 font-helvetica">Change Requests</h2>
        </div>
        <ModuleInfoTooltip title="Change Management" quickActions={quickActions} />
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-4 pr-4">
          {changeRequests.map((change, index) => (
            <div key={index} className="border-l-2 border-purple-600/20 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium text-green-600">{change.ticketId}</span>
                    <span className={`text-xs font-medium ${getPriorityColor(change.priority)}`}>
                      {change.priority}
                    </span>
                    <span className={`text-xs font-medium ${getRiskColor(change.riskLevel)}`}>
                      Risk: {change.riskLevel}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1">{change.shortDescription}</h3>
                  <div className="text-xs text-gray-600 mb-1">
                    <div>Status: {change.status}</div>
                    <div>Change Window: {change.changeWindow}</div>
                    <div>Approver: {change.approver}</div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <ActionButton
                    icon={AlertCircle}
                    label="Review"
                    onClick={() => console.log("Review change:", change.ticketId)}
                  />
                  <ActionButton
                    icon={CheckCircle}
                    label="Approve"
                    onClick={() => console.log("Approve change:", change.ticketId)}
                  />
                  <ActionButton
                    icon={Eye}
                    label="View Details"
                    onClick={() => console.log("View change:", change.ticketId)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChangeRequestTickets;
