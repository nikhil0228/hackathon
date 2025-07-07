
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { VoiceControlsProps } from "@/types/VoiceAssistant";

// TypeScript declarations for Speech Recognition API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const VoiceControls = ({ 
  isListening, 
  isSpeaking, 
  onStartListening, 
  onStopListening, 
  onStopSpeaking 
}: VoiceControlsProps) => {
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onend = () => {
        onStopListening();
      };
    }

    // Initialize speech synthesis
    synthesisRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [onStopListening]);

  const startListening = () => {
    if (recognitionRef.current) {
      onStartListening();
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    onStopListening();
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      onStopSpeaking();
    }
  };

  const speakText = (text: string, onEnd: () => void) => {
    if (synthesisRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = onEnd;
      synthesisRef.current.speak(utterance);
    }
  };

  // Expose speakText method to parent
  useEffect(() => {
    (window as any).voiceControlsSpeakText = speakText;
  }, []);

  return (
    <div className="flex gap-2 justify-center">
      <Button
        onClick={isListening ? stopListening : startListening}
        variant={isListening ? "destructive" : "default"}
        size="sm"
        className="flex-1 h-8"
      >
        {isListening ? <MicOff className="h-3 w-3 mr-1" /> : <Mic className="h-3 w-3 mr-1" />}
        {isListening ? "Stop" : "Listen"}
      </Button>
      
      <Button
        onClick={isSpeaking ? stopSpeaking : () => {}}
        variant={isSpeaking ? "destructive" : "secondary"}
        size="sm"
        className="flex-1 h-8"
        disabled={!isSpeaking}
      >
        {isSpeaking ? <VolumeX className="h-3 w-3 mr-1" /> : <Volume2 className="h-3 w-3 mr-1" />}
        {isSpeaking ? "Stop" : "Speak"}
      </Button>
    </div>
  );
};

export default VoiceControls;
