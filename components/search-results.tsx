"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Pin, Clock, Hash, X } from "lucide-react"
import type { ChatConversation, PinnedPrompt } from "@/lib/storage"

interface SearchResultsProps {
  conversations: ChatConversation[]
  prompts: PinnedPrompt[]
  searchQuery: string
  onConversationSelect: (conversation: ChatConversation) => void
  onPromptSelect: (prompt: PinnedPrompt) => void
  onClose: () => void
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

function getContextPreview(conversation: ChatConversation, query: string): string {
  const searchTerm = query.toLowerCase()

  // Find the first message that contains the search term
  const matchingMessage = conversation.messages.find((msg) => msg.content.toLowerCase().includes(searchTerm))

  if (matchingMessage) {
    const content = matchingMessage.content
    const index = content.toLowerCase().indexOf(searchTerm)
    const start = Math.max(0, index - 50)
    const end = Math.min(content.length, index + query.length + 50)

    let preview = content.slice(start, end)
    if (start > 0) preview = "..." + preview
    if (end < content.length) preview = preview + "..."

    return preview
  }

  return conversation.messages[0]?.content.slice(0, 100) + "..." || ""
}

export function SearchResults({
  conversations,
  prompts,
  searchQuery,
  onConversationSelect,
  onPromptSelect,
  onClose,
}: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<"conversations" | "prompts">("conversations")

  const hasResults = conversations.length > 0 || prompts.length > 0

  return (
    <div className="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-lg shadow-lg mt-1">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Search Results</span>
          {hasResults && (
            <Badge variant="secondary" className="text-xs">
              {conversations.length + prompts.length} found
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {hasResults ? (
        <>
          <div className="flex border-b border-border">
            <button
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "conversations"
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("conversations")}
            >
              Conversations ({conversations.length})
            </button>
            <button
              className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === "prompts"
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("prompts")}
            >
              Prompts ({prompts.length})
            </button>
          </div>

          <ScrollArea className="max-h-80">
            {activeTab === "conversations" && (
              <div className="p-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors mb-2"
                    onClick={() => onConversationSelect(conversation)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <h4 className="font-medium text-sm truncate">
                          {highlightText(conversation.title, searchQuery)}
                        </h4>
                        {conversation.pinned && <Pin className="w-3 h-3 text-primary flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {conversation.timestamp.toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {highlightText(getContextPreview(conversation, searchQuery), searchQuery)}
                    </p>

                    {conversation.tags && conversation.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {conversation.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Hash className="w-2 h-2 mr-1" />
                            {highlightText(tag, searchQuery)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "prompts" && (
              <div className="p-2">
                {prompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className="p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors mb-2"
                    onClick={() => onPromptSelect(prompt)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Pin className="w-4 h-4 text-primary flex-shrink-0" />
                        {prompt.category && (
                          <Badge variant="secondary" className="text-xs">
                            {highlightText(prompt.category, searchQuery)}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {prompt.timestamp.toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-sm">{highlightText(prompt.text, searchQuery)}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </>
      ) : (
        <div className="p-6 text-center">
          <p className="text-muted-foreground text-sm">No results found for "{searchQuery}"</p>
          <p className="text-xs text-muted-foreground mt-1">Try different keywords or check your spelling</p>
        </div>
      )}
    </div>
  )
}
