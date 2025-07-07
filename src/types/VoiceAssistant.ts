
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  followUpQuestions?: string[];
}

export interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
}

export interface MessageListProps {
  messages: Message[];
  onFollowUpClick: (question: string) => void;
}

export interface AIResponseHandlerProps {
  geminiApiKey: string;
}

export interface AIResponse {
  response: string;
  followUp: string[];
}
