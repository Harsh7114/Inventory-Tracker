// Web Speech API utilities

export const startVoiceRecognition = (
  onResult: (transcript: string) => void,
  onError?: (error: string) => void
): (() => void) => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onError?.('Speech recognition not supported in this browser');
    return () => {};
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError?.(event.error);
  };

  recognition.start();

  return () => recognition.stop();
};

export const speak = (text: string, onEnd?: () => void) => {
  if (!('speechSynthesis' in window)) {
    console.error('Text-to-speech not supported');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
  }

  window.speechSynthesis.speak(utterance);
};

export const parseVoiceCommand = (transcript: string): {
  action: 'add' | 'remove' | 'update' | 'query' | 'unknown';
  item?: string;
  quantity?: number;
} => {
  const lowerTranscript = transcript.toLowerCase();

  // Add command: "add 10 apples" or "add apples 10"
  const addMatch = lowerTranscript.match(/add\s+(\d+)\s+(\w+)|add\s+(\w+)\s+(\d+)/);
  if (addMatch) {
    return {
      action: 'add',
      quantity: parseInt(addMatch[1] || addMatch[4]),
      item: addMatch[2] || addMatch[3],
    };
  }

  // Remove command: "remove 5 bananas"
  const removeMatch = lowerTranscript.match(/remove\s+(\d+)\s+(\w+)|remove\s+(\w+)\s+(\d+)/);
  if (removeMatch) {
    return {
      action: 'remove',
      quantity: parseInt(removeMatch[1] || removeMatch[4]),
      item: removeMatch[2] || removeMatch[3],
    };
  }

  // Query command: "what's the stock of rice" or "how many apples"
  const queryMatch = lowerTranscript.match(/stock of (\w+)|how many (\w+)/);
  if (queryMatch) {
    return {
      action: 'query',
      item: queryMatch[1] || queryMatch[2],
    };
  }

  return { action: 'unknown' };
};
