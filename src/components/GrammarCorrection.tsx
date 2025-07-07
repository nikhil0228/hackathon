
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw, Wand2, Settings } from "lucide-react";
import ActionButton from "./ActionButton";
import ModuleInfoTooltip from "./ModuleInfoTooltip";

const GrammarCorrection = () => {
  const [inputText, setInputText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("AIzaSyA_qGG7EyoIxN7NQFU2TgFBruVz4aUavlY");
  const [showApiInput, setShowApiInput] = useState(false);

  const handleCorrectGrammar = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    try {
      if (geminiApiKey) {
        // Use Google Gemini API
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Please correct the grammar and make this text more formal and professional for business communication. Keep the original meaning but improve clarity and professionalism. Format it as a proper business communication:\n\n"${inputText}"`
              }]
            }]
          })
        });
        
        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          setCorrectedText(data.candidates[0].content.parts[0].text);
        } else {
          throw new Error('No response from Gemini API');
        }
      } else {
        // Fallback to basic correction
        setTimeout(() => {
          const corrected = inputText
            .replace(/\bi\b/gi, "I")
            .replace(/\bdont\b/g, "don't")
            .replace(/\bcant\b/g, "can't")
            .replace(/\bwont\b/g, "won't")
            .replace(/\bu\b/g, "you")
            .replace(/\bur\b/g, "your")
            .replace(/\bthru\b/g, "through")
            .replace(/\btho\b/g, "though")
            .replace(/\bcuz\b/g, "because")
            .replace(/\bpls\b/g, "please")
            .replace(/(\w+)\s*\.\s*(\w)/g, "$1. $2")
            .replace(/^(\w)/, (match) => match.toUpperCase())
            .replace(/\s+/g, " ")
            .trim();
          
          setCorrectedText(`Dear Team,

I would like to formally request your assistance with the following matter: ${corrected}

Please let me know if you need any additional information or clarification regarding this request.

Thank you for your time and consideration.

Best regards,
[Your Name]`);
          setIsProcessing(false);
        }, 1500);
        return;
      }
    } catch (error) {
      console.error('Grammar correction failed:', error);
      // Fallback to basic correction
      const corrected = inputText
        .replace(/\bi\b/gi, "I")
        .replace(/\bdont\b/g, "don't")
        .replace(/\bcant\b/g, "can't")
        .replace(/\bwont\b/g, "won't")
        .replace(/\bu\b/g, "you")
        .replace(/\bur\b/g, "your")
        .replace(/\bthru\b/g, "through")
        .replace(/\btho\b/g, "though")
        .replace(/\bcuz\b/g, "because")
        .replace(/\bpls\b/g, "please")
        .replace(/(\w+)\s*\.\s*(\w)/g, "$1. $2")
        .replace(/^(\w)/, (match) => match.toUpperCase())
        .replace(/\s+/g, " ")
        .trim();
      
      setCorrectedText(`Dear Team,

I would like to formally request your assistance with the following matter: ${corrected}

Please let me know if you need any additional information or clarification regarding this request.

Thank you for your time and consideration.

Best regards,
[Your Name]`);
    }
    
    setIsProcessing(false);
  };

  const handleCopy = () => {
    if (correctedText) {
      navigator.clipboard.writeText(correctedText);
    }
  };

  const handleClear = () => {
    setInputText("");
    setCorrectedText("");
  };

  const quickActions = [
    "Correct Grammar: Fix grammatical errors and improve sentence structure",
    "Make Formal: Convert casual text into professional communication",
    "Gemini API: Use Google Gemini for advanced grammar correction",
    "Copy Text: Copy the corrected text to clipboard"
  ];

  return (
    <Card className="h-full border-red-100">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-ubs-red flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Grammar Correction
          </CardTitle>
          <div className="flex items-center gap-2">
            <ActionButton 
              icon={Settings} 
              label="Gemini API Settings" 
              onClick={() => setShowApiInput(!showApiInput)} 
            />
            <ActionButton icon={Copy} label="Copy Text" onClick={handleCopy} />
            <ActionButton icon={RefreshCw} label="Clear All" onClick={handleClear} />
            <ModuleInfoTooltip title="Grammar Correction" quickActions={quickActions} />
          </div>
        </div>
        {showApiInput && (
          <div className="mt-2">
            <Input
              placeholder="Enter Google Gemini API key for enhanced grammar correction"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className="text-sm"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="h-[calc(100%-8rem)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Your Text:</label>
            <Textarea
              placeholder="Enter your text here to correct grammar and make it formal..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="h-32 resize-none"
            />
            <Button 
              onClick={handleCorrectGrammar}
              disabled={!inputText.trim() || isProcessing}
              className="w-full bg-ubs-red hover:bg-ubs-red-dark"
            >
              {isProcessing ? "Processing..." : "Correct & Formalize"}
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Corrected Text:</label>
            <Textarea
              value={correctedText}
              readOnly
              className="h-32 resize-none bg-gray-50"
              placeholder="Corrected text will appear here..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GrammarCorrection;
