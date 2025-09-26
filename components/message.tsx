"use client"

import { formatDistanceToNow } from "date-fns"
import { MessageActions } from "@/components/message-actions"
import { parseMarkdown } from "@/lib/markdown"

interface MessageProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
    attachments?: any[]
  }
  onRegenerate?: () => void
  onEdit?: () => void
}

export function Message({ message, onRegenerate, onEdit }: MessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          🌸
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? "order-first" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser ? "bg-primary text-primary-foreground ml-auto" : "bg-muted text-muted-foreground"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div
              className="text-sm leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
            />
          )}
        </div>

        <div className={`flex items-center gap-2 mt-2 ${isUser ? "justify-end" : "justify-start"}`}>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>

          {!isUser && <MessageActions message={message} onRegenerate={onRegenerate} onEdit={onEdit} />}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
          U
        </div>
      )}
    </div>
  )
}
