"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MessageSquare, Pin, PinOff, MoreHorizontal, Trash2, Edit, Hash } from "lucide-react"
import type { ChatConversation } from "@/lib/storage"

interface ChatItemProps {
  conversation: ChatConversation
  isActive?: boolean
  onSelect: (conversation: ChatConversation) => void
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
  searchQuery?: string
}

function highlightText(text: string, query?: string): React.ReactNode {
  if (!query?.trim()) return text

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

export function ChatItem({
  conversation,
  isActive = false,
  onSelect,
  onTogglePin,
  onDelete,
  searchQuery,
}: ChatItemProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  const handleTogglePin = (e: React.MouseEvent) => {
    e.stopPropagation()
    onTogglePin(conversation.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(conversation.id)
    setShowDropdown(false)
  }

  return (
    <div
      className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isActive
          ? "bg-sidebar-accent border border-sidebar-primary/20"
          : "hover:bg-sidebar-accent border border-transparent hover:border-sidebar-border"
      } ${conversation.pinned ? "ring-1 ring-sidebar-primary/20" : ""}`}
      onClick={() => onSelect(conversation)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-sidebar-foreground/50 flex-shrink-0" />
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {highlightText(conversation.title, searchQuery)}
            </p>
            {conversation.pinned && <Pin className="w-3 h-3 text-sidebar-primary flex-shrink-0" />}
          </div>

          <p className="text-xs text-sidebar-foreground/50 mb-2">
            {conversation.timestamp.toLocaleDateString()} • {conversation.messages.length} messages
          </p>

          {conversation.tags && conversation.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {conversation.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Hash className="w-2 h-2 mr-1" />
                  {highlightText(tag, searchQuery)}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={handleTogglePin}
            title={conversation.pinned ? "Unpin conversation" : "Pin conversation"}
          >
            {conversation.pinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
          </Button>

          <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleTogglePin}>
                {conversation.pinned ? (
                  <>
                    <PinOff className="w-3 h-3 mr-2" />
                    Unpin
                  </>
                ) : (
                  <>
                    <Pin className="w-3 h-3 mr-2" />
                    Pin
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="w-3 h-3 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="w-3 h-3 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
