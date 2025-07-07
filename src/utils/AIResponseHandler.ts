
import { AIResponse } from "@/types/VoiceAssistant";

export class AIResponseHandler {
  constructor(private geminiApiKey: string) {}

  private isWorkRelated(message: string): boolean {
    const workKeywords = [
      'email', 'mail', 'ticket', 'servicenow', 'gitlab', 'issue', 'meeting', 'calendar',
      'task', 'project', 'deadline', 'schedule', 'agenda', 'budget', 'client',
      'request', 'approval', 'incident', 'change', 'resource', 'access',
      'sprint', 'standup', 'review', 'presentation', 'report', 'summary', 'overview'
    ];
    
    return workKeywords.some(keyword => message.toLowerCase().includes(keyword));
  }

  private isWebSearchConfirmation(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return lowerMessage.includes('yes') || lowerMessage.includes('search') || lowerMessage.includes('web');
  }

  private getWorkData(query: string): { data: string; followUp: string[] } | null {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('email') || lowerQuery.includes('mail')) {
      return {
        data: "You have 8 unread emails. 2 are high priority from Sarah Johnson about Q4 Budget Review and Michael Chen about client requirements. 3 emails mention 'Aravind Reddy' in the body - two about project updates and one meeting invitation.",
        followUp: ["Show me high priority emails", "What's in the budget review email?", "Schedule time to respond to emails"]
      };
    } else if (lowerQuery.includes('ticket') || lowerQuery.includes('servicenow')) {
      return {
        data: "You have 7 active ServiceNow tickets: 3 incidents at severity 4 (network issues, login problems, printer maintenance), 2 service requests pending approval (software access, hardware request), and 2 change requests at medium risk (server updates, policy changes).",
        followUp: ["Show me high severity tickets", "What are the pending approvals?", "When are the change requests scheduled?"]
      };
    } else if (lowerQuery.includes('gitlab') || lowerQuery.includes('issue')) {
      return {
        data: "You have 5 GitLab issues assigned: 2 in progress (authentication flow, database optimization), 2 to-do (UI improvements, testing framework), and 1 in review (security patches). The authentication flow implementation is due today.",
        followUp: ["Show me overdue issues", "What's the status of security patches?", "Assign issues to team members"]
      };
    } else if (lowerQuery.includes('meeting') || lowerQuery.includes('calendar')) {
      return {
        data: "You have 4 meetings today: Sprint Planning at 2 PM, Q4 Budget Review at 3:30 PM, and Client Call at 4 PM. Tomorrow you have 3 meetings including 1:1 with manager and team standup.",
        followUp: ["Reschedule a meeting", "Prepare agenda for budget review", "Set reminder for client call"]
      };
    } else if (lowerQuery.includes('task') || lowerQuery.includes('todo')) {
      return {
        data: "You have 12 total tasks: 3 overdue (network connectivity, budget completion, presentation prep), 5 due today (sprint planning, documentation, code review, client follow-up, security update), and 4 upcoming this week.",
        followUp: ["Show me overdue tasks", "Mark tasks as complete", "Create new task reminder"]
      };
    } else if (lowerQuery.includes('summary') || lowerQuery.includes('overview')) {
      return {
        data: "Here's your work summary: 8 emails (2 high priority), 7 ServiceNow tickets (3 incidents, 2 requests), 5 GitLab issues (2 in progress), 4 meetings today, 3 access requests pending, and 3 overdue tasks requiring immediate attention.",
        followUp: ["Focus on overdue items", "Show me today's priorities", "Generate weekly report"]
      };
    }
    
    return null;
  }

  async getAIResponse(userMessage: string): Promise<AIResponse> {
    // Check if user is confirming web search
    if (this.isWebSearchConfirmation(userMessage) && !this.isWorkRelated(userMessage)) {
      return await this.searchWeb(userMessage);
    }

    // Check if it's work-related first
    if (this.isWorkRelated(userMessage)) {
      const workData = this.getWorkData(userMessage);
      if (workData) {
        return {
          response: workData.data,
          followUp: workData.followUp
        };
      }
    }
    
    // Use Google Gemini API for enhanced responses
    if (this.geminiApiKey) {
      try {
        const systemPrompt = this.isWorkRelated(userMessage) 
          ? `You are PAL (Personal Assistant Lite), a helpful assistant for UBS employees. The user is asking about work-related topics. Provide helpful responses about work data, tasks, emails, meetings, and suggest actionable follow-ups. Keep responses concise and professional.`
          : `You are PAL (Personal Assistant Lite), a helpful AI assistant. The user is asking a general question not related to work. Provide helpful, accurate information from your knowledge base. Keep responses concise and informative. If you don't have current information, mention that your knowledge has a cutoff date.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${systemPrompt}\n\nUser question: ${userMessage}`
              }]
            }]
          })
        });
        
        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          const responseText = data.candidates[0].content.parts[0].text;
          
          // Generate follow-up questions for work-related queries
          const followUpQuestions = this.isWorkRelated(userMessage) ? [
            "Show me more details",
            "What should I prioritize?",
            "Set a reminder for this"
          ] : [
            "Tell me more about this",
            "Can you explain further?",
            "What else should I know?"
          ];
          
          return {
            response: responseText,
            followUp: followUpQuestions
          };
        }
      } catch (error) {
        console.log("Gemini API call failed, falling back to local responses");
      }
    }
    
    // Fallback responses
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('weather')) {
      return {
        response: "I don't have access to real-time weather data. You can check weather on Google, Weather.com, or your phone's weather app. Would you like me to help you with your work-related tasks instead?",
        followUp: ["Check today's meetings", "Review pending tasks", "Show email summary"]
      };
    } else if (lowerMessage.includes('time') || lowerMessage.includes('date')) {
      const now = new Date();
      return {
        response: `Current time: ${now.toLocaleTimeString()}, Date: ${now.toLocaleDateString()}. You have several tasks scheduled for today.`,
        followUp: ["Show today's agenda", "Review upcoming deadlines", "Check meeting schedule"]
      };
    } else if (lowerMessage.includes('help')) {
      return {
        response: "I can help you with work-related information (emails, tickets, meetings, tasks) and answer general questions. For work data, I'll provide specific details and suggest follow-up actions. For general questions, I'll give you informative responses based on my knowledge.",
        followUp: ["Show work summary", "Ask a general question", "Check current tasks"]
      };
    }
    
    return {
      response: "I can help you with work-related tasks and general questions. Try asking about your emails, meetings, tasks, or any topic you're curious about. What would you like to know?",
      followUp: ["Show work overview", "Ask about a topic", "Check today's schedule"]
    };
  }

  private async searchWeb(query: string): Promise<AIResponse> {
    // For now, provide a placeholder response since we don't have web search API
    return {
      response: "I understand you'd like me to search the web, but I don't currently have access to real-time web search. I can help answer questions based on my knowledge base or assist with your work-related tasks instead.",
      followUp: ["Ask from my knowledge", "Show work overview", "Check current tasks"]
    };
  }
}
