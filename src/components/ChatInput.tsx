import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send } from 'lucide-react';

interface Model {
  id: string;
  object: string;
}

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isLoadingModels: boolean;
  selectedModel: string;
  onModelChange: (value: string) => void;
  models: Model[];
}

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isLoading,
  isLoadingModels,
  selectedModel,
  onModelChange,
  models,
}: ChatInputProps) {
  return (
    <div className="space-y-2">
      <Textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Type your message..."
        className="min-h-[60px] resize-none text-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      <div className="flex items-center justify-between space-x-2">
        <Select value={selectedModel} onValueChange={onModelChange} disabled={isLoadingModels}>
          <SelectTrigger className="h-8 w-[180px] text-xs">
            <SelectValue placeholder={isLoadingModels ? "Loading..." : "Select model"} />
          </SelectTrigger>
          <SelectContent>
            {models?.map((model) => (
              <SelectItem key={model.id} value={model.id} className="text-xs">
                {model.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={onSubmit}
          disabled={isLoading || isLoadingModels}
          size="icon"
          className="h-8 w-8"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}
