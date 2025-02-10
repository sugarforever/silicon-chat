import type { Message } from "@/types/chat"
import { Brain } from "lucide-react"

interface MessageCardProps {
  message: Message
}

export function MessageCard({ message }: MessageCardProps) {
  return (
    <div className={`flex items-start gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
      <div
        className={`group relative flex flex-col max-w-[85%] ${message.role === "user" ? "items-end" : "items-start"}`}
      >
        <div
          className={`relative overflow-hidden rounded-2xl border shadow-sm ${
            message.role === "user" ? "bg-primary" : "bg-card"
          }`}
        >
          {message.reasoning_content && message.role === "assistant" && (
            <div className="relative border-b bg-muted/50 px-4 py-3">
              <div className="absolute left-4 top-0 h-full w-[2px] bg-gradient-to-b from-primary/50 to-transparent -z-10" />
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Brain className="h-3.5 w-3.5" />
                <span>Thinking Process</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{message.reasoning_content}</div>
            </div>
          )}
          <div
            className={`px-4 py-3 text-sm leading-relaxed ${message.role === "user" ? "text-primary-foreground" : ""}`}
          >
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          </div>
        </div>
        <span className="mt-1 text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}

