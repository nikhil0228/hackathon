import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIResponseHandler } from "@/utils/AIResponseHandler";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  module?: string;
  critical?: boolean;
  url?: string;
}

// TypeScript compatibility for browsers/environments missing these types
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onaudioend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

declare global {
  interface Window {
    webkitSpeechRecognition: unknown;
    SpeechRecognition: unknown;
  }
}

const VoiceOverview = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const geminiApiKey = "AIzaSyA_qGG7EyoIxN7NQFU2TgFBruVz4aUavlY";

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window.webkitSpeechRecognition || window.SpeechRecognition) as { new (): SpeechRecognition };
      const recognitionInstance = new SpeechRecognitionConstructor();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    // Provide modular initial overview
    provideModularOverview();
  }, []);

  const handleMessageClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  const provideModularOverview = () => {
    const now = new Date();
    setLastUpdated(now);

    const overviewMessages: Message[] = [
      {
        id: `${now.getTime()}_email`,
        text: "📧 EMAILS: 8 unread messages (2 high priority from Sarah Johnson & Michael Chen). Last update: 5 minutes ago",
        isUser: false,
        timestamp: now,
        module: "communications",
        critical: true,
        url: "https://outlook.office.com"
      },
      {
        id: `${now.getTime()}_servicenow`,
        text: "🎫 SERVICENOW: 3 critical incidents requiring immediate attention. Network outage affecting production systems. Last update: 2 minutes ago",
        isUser: false,
        timestamp: now,
        module: "servicenow",
        critical: true,
        url: "https://goto/gsnow"
      },
      {
        id: `${now.getTime()}_gitlab`,
        text: "🔧 GITLAB: 5 issues assigned (2 in progress, 1 due today - authentication flow). Last update: 10 minutes ago",
        isUser: false,
        timestamp: now,
        module: "gitlab",
        url: "https://goto/gitlab"
      },
      {
        id: `${now.getTime()}_calendar`,
        text: "📅 CALENDAR: 4 meetings today - Sprint Planning at 2 PM, Budget Review at 3:30 PM (CRITICAL). Last update: 1 minute ago",
        isUser: false,
        timestamp: now,
        module: "calendar",
        critical: true,
        url: "https://calendar.outlook.com"
      },
      {
        id: `${now.getTime()}_tasks`,
        text: "✅ TASKS: 3 overdue items need immediate attention (network connectivity, budget completion). Last update: 3 minutes ago",
        isUser: false,
        timestamp: now,
        module: "tasks",
        critical: true,
        url: ""
      },
      {
        id: `${now.getTime()}_training`,
        text: "📚 MANDATORY TRAINING: 2 training modules overdue (Cybersecurity Awareness, Data Privacy). 1 due tomorrow. Last update: 1 day ago",
        isUser: false,
        timestamp: now,
        module: "mandatorytraining",
        critical: true,
        url: "https://goto/ubsuniversity"
      },
      {
        id: `${now.getTime()}_access`,
        text: "🔑 ACCESS REQUESTS: 3 pending access requests for new systems. 2 approvals needed for team members. Last update: 4 hours ago",
        isUser: false,
        timestamp: now,
        module: "resources",
        critical: false,
        url: "https://accessmanagement.company.com"
      }
    ];

    setMessages(overviewMessages);
    
    // Speak the critical items first
    const criticalItems = overviewMessages.filter(msg => msg.critical).length;
    const summaryText = `Good day! You have ${criticalItems} critical items requiring immediate attention. Check your emails, ServiceNow incidents, mandatory training, and overdue tasks first.`;
    speakText(summaryText);
  };

  const handleUserMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Check if it's work-related
    const aiHandler = new AIResponseHandler(geminiApiKey);
    const isWorkRelated = text.toLowerCase().includes('email') || 
                         text.toLowerCase().includes('ticket') || 
                         text.toLowerCase().includes('meeting') ||
                         text.toLowerCase().includes('task') ||
                         text.toLowerCase().includes('gitlab') ||
                         text.toLowerCase().includes('calendar') ||
                         text.toLowerCase().includes('overview') ||
                         text.toLowerCase().includes('summary');

    if (!isWorkRelated) {
      const confirmMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "This question doesn't seem work-related. Would you like me to search the web for an answer? Please say 'yes' or 'no'.",
        isUser: false,
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, confirmMessage]);
        speakText(confirmMessage.text);
      }, 500);
      return;
    }

    // Handle work-related questions
    const aiResponse = await aiHandler.getAIResponse(text);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse.response,
      isUser: false,
      timestamp: new Date()
    };

    setTimeout(() => {
      setMessages(prev => [...prev, aiMessage]);
      speakText(aiResponse.response);
    }, 1000);
  };

  const speakText = (text: string) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserMessage(inputText);
      setInputText("");
    }
  };

  return (
    <Card className="h-full flex flex-col border border-gray-200 overflow-hidden text-black font-frutiger font-light" style={{ backgroundColor: 'rgb(142,141,131)' }}>
      <CardHeader className="pb-2 bg-white flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-black font-frutiger">
            {/* UBS image removed */}
            <span className="text-black">PAL (Personal Assistant Lite)</span>
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-black">
            <Clock className="h-3 w-3" />
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden bg-white">
        <ScrollArea className="flex-1">
          <div className="space-y-2 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-2 rounded-lg text-sm font-frutiger text-black ${
                  message.isUser
                    ? 'bg-gray-200 ml-6'
                    : message.critical 
                      ? 'bg-gray-100 border border-gray-300 mr-6 cursor-pointer hover:shadow-sm'
                      : 'bg-white mr-6 cursor-pointer hover:shadow-sm'
                }`}
                onClick={() => !message.isUser && handleMessageClick(message.url)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {message.module && !message.isUser && (
                      <Badge className="mb-1 text-xs bg-gray-300 text-black font-frutiger font-semibold" variant={message.critical ? "destructive" : "secondary"}>
                        {message.module.toUpperCase()}
                      </Badge>
                    )}
                    <div>{message.text}</div>
                  </div>
                </div>
                <div className="text-xs mt-1 opacity-70 text-black">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 space-y-2">
          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about work overview or any question..."
              className="text-sm bg-white border-gray-300 text-black font-frutiger"
            />
            <Button type="submit" size="sm" className="bg-gray-800 hover:bg-gray-900 text-white font-frutiger font-semibold">
              Send
            </Button>
          </form>

          <div className="flex gap-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              size="sm"
              className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-frutiger font-semibold"
            >
              {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
              {isListening ? "Stop" : "Listen"}
            </Button>
            
            <Button
              onClick={isSpeaking ? stopSpeaking : () => {}}
              variant={isSpeaking ? "destructive" : "secondary"}
              size="sm"
              className="flex-1 bg-white border border-gray-300 text-black hover:bg-gray-50 font-frutiger font-semibold"
              disabled={!isSpeaking}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
              {isSpeaking ? "Stop" : "Speak"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceOverview;
