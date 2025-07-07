import { Ticket, Edit, FileText, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActionButton from "./ActionButton";
import ModuleInfoTooltip from "./ModuleInfoTooltip";

interface ServiceNowTicket {
  ticketId: string;
  shortDescription: string;
  status: string;
  priority: string;
  dueDate: string;
  sla: string;
}

const ServiceNowTickets = () => {
  const tickets: ServiceNowTicket[] = [
    {
      ticketId: "INC0012345",
      shortDescription: "Network connectivity issues in Building A",
      status: "In Progress",
      priority: "High",
      dueDate: "Today 5:00 PM",
      sla: "4h remaining"
    },
    {
      ticketId: "REQ0067891",
      shortDescription: "Software license renewal request",
      status: "Pending Approval",
      priority: "Medium",
      dueDate: "Tomorrow",
      sla: "1d 8h remaining"
    },
    {
      ticketId: "INC0012346",
      shortDescription: "Email server performance degradation",
      status: "Assigned",
      priority: "High",
      dueDate: "Today 3:00 PM",
      sla: "2h remaining"
    },
    {
      ticketId: "REQ0067892",
      shortDescription: "New user account setup for department",
      status: "New",
      priority: "Low",
      dueDate: "Dec 30",
      sla: "3d remaining"
    },
    {
      ticketId: "INC0012347",
      shortDescription: "Printer malfunction in conference room",
      status: "In Progress",
      priority: "Medium",
      dueDate: "Tomorrow 2:00 PM",
      sla: "1d 2h remaining"
    }
  ];

  const quickActions = [
    "Update Status - Change ticket status",
    "Add Work Notes - Add progress notes",
    "View in ServiceNow - Open ticket in ServiceNow"
  ];

  const handleUpdateStatus = (ticket: ServiceNowTicket) => {
    console.log("Update status for:", ticket.ticketId);
  };

  const handleAddWorkNotes = (ticket: ServiceNowTicket) => {
    console.log("Add work notes for:", ticket.ticketId);
  };

  const handleViewInServiceNow = (ticket: ServiceNowTicket) => {
    console.log("View in ServiceNow:", ticket.ticketId);
  };

  const getPriorityColor = (priority: string) => {
    return priority === "High" ? "text-ubs-red" : "text-gray-600";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Ticket className="h-5 w-5 text-ubs-red mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 font-helvetica">ServiceNow Tickets</h2>
        </div>
        <ModuleInfoTooltip title="ServiceNow Tickets" quickActions={quickActions} />
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-4 pr-4">
          {tickets.map((ticket, index) => (
            <div key={index} className="border-l-2 border-ubs-red/20 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-sm font-medium text-green-600">{ticket.ticketId}</span>
                    <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1">{ticket.shortDescription}</h3>
                  <div className="flex gap-4 text-xs text-gray-600">
                    <span>Status: {ticket.status}</span>
                    <span>Due: {ticket.dueDate}</span>
                    <span>SLA: {ticket.sla}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <ActionButton
                    icon={Edit}
                    label="Update Status"
                    onClick={() => handleUpdateStatus(ticket)}
                  />
                  <ActionButton
                    icon={FileText}
                    label="Add Work Notes"
                    onClick={() => handleAddWorkNotes(ticket)}
                  />
                  <ActionButton
                    icon={Eye}
                    label="View in ServiceNow"
                    onClick={() => handleViewInServiceNow(ticket)}
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

export default ServiceNowTickets;
