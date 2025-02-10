import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Select value={selectedModel} onValueChange={onModelChange} disabled={isLoadingModels}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={isLoadingModels ? "Loading models..." : "Select model"} />
          </SelectTrigger>
          <SelectContent>
            {models?.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex space-x-2">
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your message..."
          className="min-h-[60px] flex-1 resize-none text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
        <Button
          onClick={onSubmit}
          disabled={isLoading || isLoadingModels}
          className="self-end"
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
