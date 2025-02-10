"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChatInput } from "@/components/ChatInput";

interface Message {
  role: "user" | "assistant";
  content: string;
  reasoning_content?: string;
}

interface Model {
  id: string;
  object: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    const apiKey = localStorage.getItem("siliconflow_api_key");
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your SiliconFlow API key in the settings page.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingModels(true);
    try {
      const response = await fetch("https://api.siliconflow.cn/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      const data = await response.json();
      setModels(data.data || []);
      if (data.data?.length > 0) {
        setSelectedModel(data.data[0].id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch models. Please check your API key.",
        variant: "destructive",
      });
      setModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    if (!selectedModel) {
      toast({
        title: "Model Required",
        description: "Please select a model first.",
        variant: "destructive",
      });
      return;
    }

    const apiKey = localStorage.getItem("siliconflow_api_key");
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your SiliconFlow API key in the settings page.",
        variant: "destructive",
      });
      return;
    }

    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [...messages, newMessage].map(({ role, content }) => ({
            role,
            content,
          })),
          stream: true,
          max_tokens: 512,
          temperature: 0.7,
          top_p: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Add an empty assistant message that we'll update with the stream
      setMessages((prev) => [...prev, { role: "assistant", content: "", reasoning_content: "" }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      let accumulatedContent = "";
      let accumulatedReasoning = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;

            const data = line.slice(5).trim();

            // Handle stream termination
            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta;
              if (!delta) continue;

              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === "assistant") {
                  // Handle content
                  if (delta.content !== null && delta.content !== undefined) {
                    const newContent = delta.content || "";
                    if (!accumulatedContent.endsWith(newContent)) {
                      accumulatedContent += newContent;
                      lastMessage.content = accumulatedContent;
                    }
                  }
                  // Handle reasoning content
                  if (delta.reasoning_content !== null && delta.reasoning_content !== undefined) {
                    const newReasoning = delta.reasoning_content || "";
                    if (!accumulatedReasoning.endsWith(newReasoning)) {
                      accumulatedReasoning += newReasoning;
                      lastMessage.reasoning_content = accumulatedReasoning;
                    }
                  }
                }
                return newMessages;
              });
            } catch (e) {
              console.error('Error parsing SSE message:', e);
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <Card key={index} className={`p-4 ${message.role === "user" ? "bg-primary-foreground" : "bg-muted"}`}>
              {message.reasoning_content && (
                <div className="mb-2 text-xs text-muted-foreground">{message.reasoning_content}</div>
              )}
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            </Card>
          ))}
        </div>
      </div>
      <div className="border-t bg-background p-4">
        <ChatInput
          input={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isLoadingModels={isLoadingModels}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          models={models}
        />
      </div>
    </div>
  );
}
