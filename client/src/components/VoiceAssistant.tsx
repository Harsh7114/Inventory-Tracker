import { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { inventoryAPI } from '@/lib/api';
import type { InventoryItem } from '@/types';

interface VoiceAssistantProps {
  onCommandProcessed?: () => void;
}

interface VoiceProcessingResult {
  transcript: string;
  items: Omit<InventoryItem, 'id' | 'lastUpdated'>[];
}

export const VoiceAssistant = ({ onCommandProcessed }: VoiceAssistantProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info('Recording... Speak now!');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to access microphone. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      toast.info('Processing your speech...');

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/voice/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const result: VoiceProcessingResult = await response.json();

      if (!result.transcript) {
        toast.error('No speech detected. Please try again.');
        return;
      }

      toast.info(`Heard: "${result.transcript}"`);

      if (result.items.length === 0) {
        toast.warning('No items detected. Try saying: "Add 5 apples and 2 bottles of milk"');
        return;
      }

      for (const item of result.items) {
        await inventoryAPI.create(item);
      }

      const itemSummary = result.items
        .map(item => `${item.quantity} ${item.name}`)
        .join(', ');
      
      toast.success(`Added: ${itemSummary}`);
      onCommandProcessed?.();
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error('Failed to process voice input. Please try again.');
    }
  };

  const handleVoiceClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      size="lg"
      className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg ${
        isRecording ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
      }`}
      onClick={handleVoiceClick}
      data-testid="button-voice-assistant"
    >
      {isRecording ? (
        <MicOff className="h-6 w-6" />
      ) : (
        <Mic className="h-6 w-6" />
      )}
    </Button>
  );
};
