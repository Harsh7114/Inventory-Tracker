import { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { startVoiceRecognition, parseVoiceCommand } from '@/lib/speech';
import { inventoryAPI } from '@/lib/api';

interface VoiceAssistantProps {
  onCommandProcessed?: () => void;
}

export const VoiceAssistant = ({ onCommandProcessed }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [stopRecognition, setStopRecognition] = useState<(() => void) | null>(null);

  const handleVoiceClick = () => {
    if (isListening) {
      stopRecognition?.();
      setIsListening(false);
      setStopRecognition(null);
      return;
    }

    const stop = startVoiceRecognition(
      async (transcript) => {
        setIsListening(false);
        setStopRecognition(null);
        
        toast.info(`Heard: "${transcript}"`);
        
        const command = parseVoiceCommand(transcript);
        
        if (command.action === 'query' && command.item) {
          const items = await inventoryAPI.getAll();
          const item = items.find(i => 
            i.name.toLowerCase().includes(command.item!.toLowerCase())
          );
          
          if (item) {
            toast.success(`${item.name}: ${item.quantity} units in stock`);
          } else {
            toast.error(`Item "${command.item}" not found`);
          }
        } else if (command.action === 'add' && command.item && command.quantity) {
          const items = await inventoryAPI.getAll();
          const item = items.find(i => 
            i.name.toLowerCase().includes(command.item!.toLowerCase())
          );
          
          if (item) {
            await inventoryAPI.update(item.id, {
              quantity: item.quantity + command.quantity,
            });
            toast.success(`Added ${command.quantity} ${item.name}`);
            onCommandProcessed?.();
          } else {
            toast.error(`Item "${command.item}" not found`);
          }
        } else if (command.action === 'remove' && command.item && command.quantity) {
          const items = await inventoryAPI.getAll();
          const item = items.find(i => 
            i.name.toLowerCase().includes(command.item!.toLowerCase())
          );
          
          if (item) {
            await inventoryAPI.update(item.id, {
              quantity: Math.max(0, item.quantity - command.quantity),
            });
            toast.success(`Removed ${command.quantity} ${item.name}`);
            onCommandProcessed?.();
          } else {
            toast.error(`Item "${command.item}" not found`);
          }
        } else {
          toast.error('Command not recognized. Try: "Add 10 apples" or "What\'s the stock of rice?"');
        }
      },
      (error) => {
        setIsListening(false);
        setStopRecognition(null);
        toast.error(`Voice recognition error: ${error}`);
      }
    );

    setIsListening(true);
    setStopRecognition(() => stop);
  };

  return (
    <Button
      size="lg"
      className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg ${
        isListening ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
      }`}
      onClick={handleVoiceClick}
    >
      {isListening ? (
        <MicOff className="h-6 w-6" />
      ) : (
        <Mic className="h-6 w-6" />
      )}
    </Button>
  );
};
