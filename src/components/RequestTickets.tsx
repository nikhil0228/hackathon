
import { FileText, Eye, CheckCircle, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActionButton from "./ActionButton";
import ModuleInfoTooltip from "./ModuleInfoTooltip";

interface Request {
  ticketId: string;
  shortDescription: string;
  priority: string;
  status: string;
  requestor: string;
  createdDate: string;
  dueDate: string;
}

const RequestTickets = () => {
  const requests: Request[] = [
    {
      ticketId: "REQ0067891",
      shortDescription: "Software license renewal request",
      priority: "Medium",
      status: "Pending Approval",
      requestor: "Michael Chen",
      createdDate: "1 day ago",
      dueDate: "Tomorrow"
    },
    {
      ticketId: "REQ0067892",
      shortDescription: "New user account setup for department",
      priority: "Low",
      status: "New",
      requestor: "Lisa Rodriguez",
      createdDate: "2 days ago",
      dueDate: "Dec 30"
    },
    {
      ticketId: "REQ0067893",
      shortDescription: "Hardware procurement for new employee",
      priority: "Medium",
      status: "In Progress",
      requestor: "David Kim",
      createdDate: "3 days ago",
      dueDate: "Next week"
    }
  ];

  const quickActions = [
    "Approve Request - Approve or reject request",
    "Assign Agent - Assign to fulfillment agent",
    "View Details - See full request details",
    "Update Status - Change request status"
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-orange-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 font-helvetica">Service Requests</h2>
        </div>
        <ModuleInfoTooltip title="Service Requests" quickActions={quickActions} />
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-4 pr-4">
          {requests.map((request, index) => (
            <div key={index} className="border-l-2 border-blue-600/20 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium text-green-600">{request.ticketId}</span>
                    <span className={`text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1">{request.shortDescription}</h3>
                  <div className="flex gap-4 text-xs text-gray-600">
                    <span>Status: {request.status}</span>
                    <span>Due: {request.dueDate}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Requestor: {request.requestor}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <ActionButton
                    icon={CheckCircle}
                    label="Approve"
                    onClick={() => console.log("Approve request:", request.ticketId)}
                  />
                  <ActionButton
                    icon={User}
                    label="Assign"
                    onClick={() => console.log("Assign request:", request.ticketId)}
                  />
                  <ActionButton
                    icon={Eye}
                    label="View Details"
                    onClick={() => console.log("View request:", request.ticketId)}
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

export default RequestTickets;
