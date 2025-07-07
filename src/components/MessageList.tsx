
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageListProps } from "@/types/VoiceAssistant";

const MessageList = ({ messages, onFollowUpClick }: MessageListProps) => {
  return (
    <ScrollArea className="flex-1 max-h-80">
      <div className="space-y-2 pr-2">
        {messages.length === 0 && (
          <div className="text-xs text-gray-500 text-center py-4">
            Hi! I'm your AI assistant powered by Google Gemini. Ask me about your work (emails, tickets, meetings) or any general questions. I'll provide relevant details and suggest follow-up actions.
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div
              className={`p-2 rounded text-xs ${
                message.isUser
                  ? 'bg-ubs-red text-white ml-4'
                  : 'bg-gray-100 text-gray-800 mr-4'
              }`}
            >
              {message.text}
              <div className={`text-xs mt-1 opacity-70 ${
                message.isUser ? 'text-white' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            {/* Follow-up questions */}
            {!message.isUser && message.followUpQuestions && (
              <div className="space-y-1 mr-4">
                <div className="text-xs text-gray-500 font-medium">Suggested follow-ups:</div>
                {message.followUpQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => onFollowUpClick(question)}
                    className="block w-full text-left text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
