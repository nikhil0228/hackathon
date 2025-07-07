
import { AlertTriangle, Eye, Edit, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActionButton from "./ActionButton";
import ModuleInfoTooltip from "./ModuleInfoTooltip";

interface Incident {
  ticketId: string;
  shortDescription: string;
  priority: string;
  status: string;
  assignedTo: string;
  createdDate: string;
  sla: string;
}

const IncidentTickets = () => {
  const incidents: Incident[] = [
    {
      ticketId: "INC0012345",
      shortDescription: "Server outage affecting production systems",
      priority: "Critical",
      status: "In Progress",
      assignedTo: "John Smith",
      createdDate: "2 hours ago",
      sla: "30min remaining"
    },
    {
      ticketId: "INC0012346",
      shortDescription: "Email server performance degradation",
      priority: "High",
      status: "Assigned",
      assignedTo: "Sarah Johnson",
      createdDate: "4 hours ago",
      sla: "2h remaining"
    },
    {
      ticketId: "INC0012347",
      shortDescription: "Network connectivity issues in Building A",
      priority: "High",
      status: "New",
      assignedTo: "Unassigned",
      createdDate: "6 hours ago",
      sla: "4h remaining"
    }
  ];

  const quickActions = [
    "Assign Incident - Assign to technician",
    "Update Status - Change incident status",
    "View Details - See full incident details",
    "Escalate - Escalate to higher priority"
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "text-red-600";
      case "High": return "text-orange-600";
      case "Medium": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 font-helvetica">Incident Tickets</h2>
        </div>
        <ModuleInfoTooltip title="Incident Management" quickActions={quickActions} />
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-4 pr-4">
          {incidents.map((incident, index) => (
            <div key={index} className="border-l-2 border-red-600/20 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium text-green-600">{incident.ticketId}</span>
                    <span className={`text-xs font-medium ${getPriorityColor(incident.priority)}`}>
                      {incident.priority}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1">{incident.shortDescription}</h3>
                  <div className="flex gap-4 text-xs text-gray-600">
                    <span>Status: {incident.status}</span>
                    <span>Created: {incident.createdDate}</span>
                    <span className="text-red-600">SLA: {incident.sla}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Assigned: {incident.assignedTo}
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <ActionButton
                    icon={User}
                    label="Assign"
                    onClick={() => console.log("Assign incident:", incident.ticketId)}
                  />
                  <ActionButton
                    icon={Edit}
                    label="Update"
                    onClick={() => console.log("Update incident:", incident.ticketId)}
                  />
                  <ActionButton
                    icon={Eye}
                    label="View Details"
                    onClick={() => console.log("View incident:", incident.ticketId)}
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

export default IncidentTickets;
