
import { Mail, Reply, Forward, Archive, Star, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import ActionButton from "./ActionButton";
import ModuleInfoTooltip from "./ModuleInfoTooltip";

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  isUnread: boolean;
  isImportant: boolean;
  mentionedUsers?: string[];
  chatType?: 'teams' | 'slack' | 'email';
}

const EnhancedOutlookMail = () => {
  const emails: Email[] = [
    {
      id: "1",
      from: "Sarah Johnson",
      subject: "Q4 Budget Review Meeting",
      preview: "Hi @John Smith, @Lisa Martinez - Can we schedule the quarterly budget review? @Michael Chen will present the numbers...",
      time: "2 hours ago",
      isUnread: true,
      isImportant: true,
      mentionedUsers: ["John Smith", "Lisa Martinez", "Michael Chen"],
      chatType: 'teams'
    },
    {
      id: "2", 
      from: "IT Security Team",
      subject: "Security Patch Deployment Notice",
      preview: "Dear @All Users, @David Kim @Emma White - Please note that security patches will be deployed tonight. Contact @IT Support if issues arise...",
      time: "4 hours ago",
      isUnread: true,
      isImportant: true,
      mentionedUsers: ["All Users", "David Kim", "Emma White", "IT Support"],
      chatType: 'email'
    },
    {
      id: "3",
      from: "Project Manager",
      subject: "Sprint Review - Action Items",
      preview: "@Tom Brown @Alice Wilson - Following up on yesterday's sprint review. @QA Team needs to review the test cases...",
      time: "6 hours ago",
      isUnread: false,
      isImportant: false,
      mentionedUsers: ["Tom Brown", "Alice Wilson", "QA Team"],
      chatType: 'slack'
    },
    {
      id: "4",
      from: "HR Department",
      subject: "Holiday Schedule Update",
      preview: "Team, @Department Heads @All Managers - Please review the updated holiday schedule for Q1 2025...",
      time: "1 day ago",
      isUnread: false,
      isImportant: false,
      mentionedUsers: ["Department Heads", "All Managers"],
      chatType: 'email'
    },
    {
      id: "5",
      from: "Client Relations",
      subject: "Client Feedback - Project Alpha",
      preview: "@Project Lead @Development Team - The client has provided positive feedback on Project Alpha. @Quality Team did excellent work...",
      time: "1 day ago",
      isUnread: true,
      isImportant: false,
      mentionedUsers: ["Project Lead", "Development Team", "Quality Team"],
      chatType: 'teams'
    }
  ];

  const quickActions = [
    "Reply to Urgent - 2 high priority emails need immediate response",
    "Review Mentions - You are mentioned in 8 messages across platforms",
    "Archive Read - Clean up processed emails"
  ];

  const getChatTypeIcon = (type?: string) => {
    switch (type) {
      case 'teams': return '💬';
      case 'slack': return '📱';
      default: return '📧';
    }
  };

  const getChatTypeColor = (type?: string) => {
    switch (type) {
      case 'teams': return 'text-blue-600';
      case 'slack': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const renderPreviewWithMentions = (preview: string, mentionedUsers?: string[]) => {
    if (!mentionedUsers || mentionedUsers.length === 0) {
      return preview;
    }

    let formattedPreview = preview;
    mentionedUsers.forEach(user => {
      const userPattern = new RegExp(`@${user.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi');
      formattedPreview = formattedPreview.replace(
        userPattern, 
        `<span class="bg-blue-100 text-blue-800 px-1 rounded font-medium">@${user}</span>`
      );
    });

    return <div dangerouslySetInnerHTML={{ __html: formattedPreview }} />;
  };

  const getUrgentSummary = () => {
    const unreadCount = emails.filter(email => email.isUnread).length;
    const importantCount = emails.filter(email => email.isImportant && email.isUnread).length;
    const totalMentions = emails.reduce((sum, email) => sum + (email.mentionedUsers?.length || 0), 0);
    
    if (importantCount > 0) {
      return `🚨 URGENT: ${importantCount} important unread emails need immediate attention`;
    } else if (unreadCount > 0) {
      return `📨 ACTION NEEDED: ${unreadCount} unread emails, ${totalMentions} user mentions across all messages`;
    }
    return "✅ All emails are up to date";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 font-helvetica">Communications</h2>
          <Badge className="ml-2 bg-blue-600">
            {emails.filter(email => email.isUnread).length} unread
          </Badge>
        </div>
        <ModuleInfoTooltip title="Email & Chat Integration" quickActions={quickActions} />
      </div>

      {/* Urgent Summary */}
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-medium text-blue-800">{getUrgentSummary()}</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-4">
          {emails.map((email) => (
            <div
              key={email.id}
              className={`p-4 rounded-lg border transition-colors ${
                email.isUnread 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs ${getChatTypeColor(email.chatType)}`}>
                      {getChatTypeIcon(email.chatType)} {email.chatType?.toUpperCase() || 'EMAIL'}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{email.from}</span>
                    {email.isImportant && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    {email.isUnread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 mb-1">{email.subject}</h3>
                  <div className="text-xs text-gray-600 mb-2">
                    {renderPreviewWithMentions(email.preview, email.mentionedUsers)}
                  </div>
                  {email.mentionedUsers && email.mentionedUsers.length > 0 && (
                    <div className="flex items-center gap-1 mb-2">
                      <User className="h-3 w-3 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        Mentions: {email.mentionedUsers.length} users
                      </span>
                    </div>
                  )}
                  <span className="text-xs text-gray-500">{email.time}</span>
                </div>
                
                <div className="flex gap-1 ml-4">
                  <ActionButton
                    icon={Reply}
                    label="Reply"
                    onClick={() => console.log("Reply to email:", email.id)}
                  />
                  <ActionButton
                    icon={Forward}
                    label="Forward"
                    onClick={() => console.log("Forward email:", email.id)}
                  />
                  <ActionButton
                    icon={Archive}
                    label="Archive"
                    onClick={() => console.log("Archive email:", email.id)}
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

export default EnhancedOutlookMail;
