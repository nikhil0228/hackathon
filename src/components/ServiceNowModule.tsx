import { useState, useEffect } from "react";
import { Ticket, AlertTriangle, ChevronDown, ChevronRight, Clock, User, Minus, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { serviceNowAPI, ServiceNowTicket } from "@/services/ServiceNowAPI";
import ServiceNowConfigDialog from "./ServiceNowConfigDialog";

interface ServiceNowModuleProps {
  onMinimize?: () => void;
}

const ServiceNowModule = ({ onMinimize }: ServiceNowModuleProps) => {
  const [isIncidentsOpen, setIsIncidentsOpen] = useState(true);
  const [isRequestsOpen, setIsRequestsOpen] = useState(true);
  const [isChangesOpen, setIsChangesOpen] = useState(true);
  const [tickets, setTickets] = useState<ServiceNowTicket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isApiConfigured, setIsApiConfigured] = useState(false);
  const [userId, setUserId] = useState(() => localStorage.getItem("customUserId") || "");
  const [customToken, setCustomToken] = useState(() => localStorage.getItem("customToken") || "");
  const [inputUserId, setInputUserId] = useState(userId);
  const [inputToken, setInputToken] = useState(customToken);

  useEffect(() => {
    localStorage.setItem("customUserId", userId);
    localStorage.setItem("customToken", customToken);
    loadTickets(); // Fetch incidents with new credentials
    // eslint-disable-next-line
  }, [userId, customToken]);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      // Use custom API for incidents, ServiceNow for others
      const [incidents, requests, changes] = await Promise.all([
        serviceNowAPI.fetchCustomIncidents(userId, customToken),
        serviceNowAPI.fetchRequests(),
        serviceNowAPI.fetchChanges()
      ]);
      setTickets([...incidents, ...requests, ...changes]);
      setLastUpdated(new Date());
      setIsApiConfigured(serviceNowAPI.isConfigured());
    } catch (error) {
      console.error('Error loading ServiceNow tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadTickets();
  };

  const handleConfigUpdate = () => {
    loadTickets(); // Reload tickets when configuration changes
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-100 text-red-800 border-red-300';
      case 'P2': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'P3': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'P4': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderTicketList = (ticketList: ServiceNowTicket[]) => (
    <div className="space-y-3">
      {ticketList.map((ticket) => (
        <div key={ticket.id} className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-mono text-gray-600">{ticket.number}</span>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status}
                </Badge>
              </div>
              <h3 className="text-sm font-medium text-gray-800 mb-1">{ticket.title}</h3>
              <p className="text-xs text-gray-600 mb-2">{ticket.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {ticket.assignedTo}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Updated: {ticket.updatedDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const incidents = tickets.filter(t => t.category === 'Incident');
  const requests = tickets.filter(t => t.category === 'Request');
  const changes = tickets.filter(t => t.category === 'Change');

  return (
    <>
      {/* Config Form */}
      <div className="p-4 bg-gray-50 border-b flex gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">User ID</label>
          <input
            type="text"
            value={inputUserId}
            onChange={e => setInputUserId(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
            placeholder="Enter User ID"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Bearer Token</label>
          <input
            type="password"
            value={inputToken}
            onChange={e => setInputToken(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
            placeholder="Enter Bearer Token"
          />
        </div>
        <button
          className="bg-ubs-red text-white px-4 py-2 rounded font-medium"
          onClick={() => {
            setUserId(inputUserId);
            setCustomToken(inputToken);
          }}
        >
          Submit
        </button>
      </div>
      <Card className="h-full flex flex-col bg-white border border-gray-200 overflow-hidden">
        <CardHeader className="pb-2 bg-white flex-shrink-0 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-ubs-red font-ubs-headline">
                <Ticket className="h-5 w-5" />
                ServiceNow Tickets
                <Badge className="bg-red-600 text-white">
                  {tickets.length} active
                </Badge>
                {isApiConfigured && (
                  <Badge className="bg-green-600 text-white text-xs">
                    API Connected
                  </Badge>
                )}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-ubs-medium-grey font-frutiger">
                <Clock className="h-3 w-3" />
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
              <ServiceNowConfigDialog onConfigUpdate={handleConfigUpdate} />
              <Button 
                onClick={handleRefresh}
                variant="ghost" 
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
                disabled={isLoading}
                title="Refresh tickets"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              {onMinimize && (
                <Button 
                  onClick={onMinimize}
                  variant="ghost" 
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden bg-white p-4">
          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-2">
              {/* Incidents Section */}
              <Collapsible open={isIncidentsOpen} onOpenChange={setIsIncidentsOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  {isIncidentsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">Incidents</span>
                  <Badge className="ml-auto bg-red-600 text-white">
                    {incidents.length}
                  </Badge>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  {renderTicketList(incidents)}
                </CollapsibleContent>
              </Collapsible>

              {/* Requests Section */}
              <Collapsible open={isRequestsOpen} onOpenChange={setIsRequestsOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  {isRequestsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <Ticket className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Service Requests</span>
                  <Badge className="ml-auto bg-blue-600 text-white">
                    {requests.length}
                  </Badge>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  {renderTicketList(requests)}
                </CollapsibleContent>
              </Collapsible>

              {/* Changes Section */}
              <Collapsible open={isChangesOpen} onOpenChange={setIsChangesOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  {isChangesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <AlertTriangle className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-800">Change Requests</span>
                  <Badge className="ml-auto bg-purple-600 text-white">
                    {changes.length}
                  </Badge>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  {renderTicketList(changes)}
                </CollapsibleContent>
              </Collapsible>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
};

export default ServiceNowModule;
