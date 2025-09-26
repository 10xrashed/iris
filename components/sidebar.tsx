"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Settings, Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react"
import { useTheme } from "next-themes"
import { useChatHistory, useCurrentChat } from "@/hooks/use-chat-storage"
import { EnhancedSearch } from "@/components/enhanced-search"
import { PinnedPromptsSection } from "@/components/pinned-prompts-section"
import { ChatItem } from "@/components/chat-item"
import type { ChatConversation, PinnedPrompt } from "@/lib/storage"

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  onNewChat?: () => void
  onConversationSelect?: (conversation: ChatConversation) => void
  onPromptSelect?: (prompt: string) => void
}

export function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  onNewChat,
  onConversationSelect,
  onPromptSelect,
}: SidebarProps) {
  const { theme, setTheme } = useTheme()
  const { conversations, togglePin, deleteConversation } = useChatHistory()
  const { currentChatId, setCurrentChat } = useCurrentChat()
  const [mounted, setMounted] = useState(false)

  // Separate pinned and unpinned conversations
  const pinnedConversations = conversations.filter((conv) => conv.pinned)
  const unpinnedConversations = conversations.filter((conv) => !conv.pinned)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConversationSelect = (conversation: ChatConversation) => {
    setCurrentChat(conversation.id)
    onConversationSelect?.(conversation)
  }

  const handleSearchConversationSelect = (conversation: ChatConversation) => {
    handleConversationSelect(conversation)
  }

  const handleSearchPromptSelect = (prompt: PinnedPrompt) => {
    onPromptSelect?.(prompt.text)
  }

  const handlePromptSelect = (prompt: string) => {
    onPromptSelect?.(prompt)
  }

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div
      className={`h-full bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-80"
      } fixed left-0 top-0 z-40 shadow-lg`}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="text-2xl">🌸</div>
              <div>
                <h1 className="text-xl font-semibold text-sidebar-foreground">Iris</h1>
                <p className="text-sm text-sidebar-foreground/70">AI Content Co-pilot</p>
              </div>
            </div>
          )}

          {isCollapsed && <div className="text-2xl mx-auto">🌸</div>}

          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          )}
        </div>

        {!isCollapsed && (
          <Button
            className="w-full mt-4 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 transition-colors"
            onClick={onNewChat}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        )}

        {isCollapsed && (
          <Button
            size="sm"
            className="w-full mt-4 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 transition-colors"
            onClick={onNewChat}
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>

      {!isCollapsed && (
        <>
          {/* Enhanced Search */}
          <div className="p-4 border-b border-sidebar-border">
            <EnhancedSearch
              onConversationSelect={handleSearchConversationSelect}
              onPromptSelect={handleSearchPromptSelect}
              placeholder="Search chats and prompts..."
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                {/* Pinned Prompts Section */}
                <PinnedPromptsSection onPromptSelect={handlePromptSelect} />

                <Separator />

                {/* Pinned Conversations */}
                {pinnedConversations.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-sidebar-foreground">Pinned Chats</h3>
                      <Badge variant="secondary" className="text-xs">
                        {pinnedConversations.length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {pinnedConversations.map((conversation) => (
                        <ChatItem
                          key={conversation.id}
                          conversation={conversation}
                          isActive={currentChatId === conversation.id}
                          onSelect={handleConversationSelect}
                          onTogglePin={togglePin}
                          onDelete={deleteConversation}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {pinnedConversations.length > 0 && unpinnedConversations.length > 0 && <Separator />}

                {/* Recent Conversations */}
                {unpinnedConversations.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-sidebar-foreground">Recent Chats</h3>
                      <Badge variant="secondary" className="text-xs">
                        {unpinnedConversations.length}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {unpinnedConversations.slice(0, 20).map((conversation) => (
                        <ChatItem
                          key={conversation.id}
                          conversation={conversation}
                          isActive={currentChatId === conversation.id}
                          onSelect={handleConversationSelect}
                          onTogglePin={togglePin}
                          onDelete={deleteConversation}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {conversations.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">💬</div>
                    <p className="text-sm text-sidebar-foreground/70 mb-2">No conversations yet</p>
                    <p className="text-xs text-sidebar-foreground/50">
                      Start a new chat to begin creating content with Iris
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </>
      )}

      {/* Collapsed State Content */}
      {isCollapsed && (
        <div className="flex-1 flex flex-col items-center py-4 space-y-4">
          {/* Show only pinned conversations count */}
          {pinnedConversations.length > 0 && (
            <div className="relative">
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                📌
              </Button>
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 text-xs w-5 h-5 p-0 flex items-center justify-center"
              >
                {pinnedConversations.length}
              </Badge>
            </div>
          )}

          {/* Show total conversations count */}
          {conversations.length > 0 && (
            <div className="relative">
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                💬
              </Button>
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 text-xs w-5 h-5 p-0 flex items-center justify-center"
              >
                {conversations.length}
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={`flex items-center ${isCollapsed ? "flex-col space-y-2" : "justify-between"}`}>
          <Button
            variant="ghost"
            size={isCollapsed ? "sm" : "icon"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size={isCollapsed ? "sm" : "icon"}
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
