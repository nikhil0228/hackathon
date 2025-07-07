
import { Mail, Reply, Archive, Eye, CheckCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActionButton from "./ActionButton";
import ModuleInfoTooltip from "./ModuleInfoTooltip";

interface EmailMention {
  sender: string;
  subject: string;
  dateTime: string;
  snippet: string;
  isRead: boolean;
  date: string;
}

const OutlookMail = () => {
  const emailMentions: EmailMention[] = [
    {
      sender: "Sarah Johnson",
      subject: "Q4 Budget Review - Need your input",
      dateTime: "10:30 AM",
      snippet: "Hi there, could you please review the attached budget proposal and provide your feedback by EOD?",
      isRead: false,
      date: "Today"
    },
    {
      sender: "Michael Chen",
      subject: "Project Alpha Status Update",
      dateTime: "9:15 AM",
      snippet: "The latest milestone has been completed ahead of schedule. Your expertise would be valuable for the next phase.",
      isRead: true,
      date: "Today"
    },
    {
      sender: "Lisa Rodriguez",
      subject: "Client Meeting Follow-up",
      dateTime: "4:30 PM",
      snippet: "Following up on yesterday's client meeting. We need to discuss the implementation timeline.",
      isRead: false,
      date: "Yesterday"
    },
    {
      sender: "David Kim",
      subject: "Security Protocol Updates",
      dateTime: "2:15 PM",
      snippet: "Please review the new security protocols and confirm your understanding by tomorrow.",
      isRead: true,
      date: "Yesterday"
    },
    {
      sender: "Emma Thompson",
      subject: "Team Building Event Planning",
      dateTime: "11:45 AM",
      snippet: "Your input on the team building activities would be greatly appreciated for next month's event.",
      isRead: false,
      date: "Yesterday"
    }
  ];

  const quickActions = [
    "Reply - Respond to the email directly",
    "Archive - Move email to archived folder",
    "Mark as Read - Change read status",
    "View in Outlook - Open email in Outlook app"
  ];

  const handleReply = (email: EmailMention) => {
    console.log("Reply to:", email.sender);
  };

  const handleArchive = (email: EmailMention) => {
    console.log("Archive email from:", email.sender);
  };

  const handleMarkAsRead = (email: EmailMention) => {
    console.log("Mark as read:", email.subject);
  };

  const handleViewInOutlook = (email: EmailMention) => {
    console.log("View in Outlook:", email.subject);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-ubs-red mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 font-helvetica">Outlook Mail Mentions</h2>
        </div>
        <ModuleInfoTooltip title="Email Mentions" quickActions={quickActions} />
      </div>
      
      <div className="text-xs text-gray-500 mb-3">Last 2 days</div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-4 pr-4">
          {emailMentions.map((email, index) => (
            <div key={index} className="border-l-2 border-ubs-red/20 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{email.sender}</span>
                    {!email.isRead && (
                      <div className="w-2 h-2 bg-ubs-red rounded-full"></div>
                    )}
                    <span className="text-xs text-gray-500">• {email.date}</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1">{email.subject}</h3>
                  <p className="text-xs text-gray-600 mb-2">{email.snippet}</p>
                  <span className="text-xs text-gray-500">{email.dateTime}</span>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <ActionButton
                    icon={Reply}
                    label="Reply"
                    onClick={() => handleReply(email)}
                  />
                  <ActionButton
                    icon={Archive}
                    label="Archive"
                    onClick={() => handleArchive(email)}
                  />
                  <ActionButton
                    icon={CheckCircle}
                    label="Mark as Read"
                    onClick={() => handleMarkAsRead(email)}
                  />
                  <ActionButton
                    icon={Eye}
                    label="View in Outlook"
                    onClick={() => handleViewInOutlook(email)}
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

export default OutlookMail;
