"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Send, Paperclip, Sparkles, Video, TrendingUp, FileText, Pin } from "lucide-react"
import { Message } from "@/components/message"
import { QuickActions } from "@/components/quick-actions"
import { ContentTemplates } from "@/components/content-templates"
import { PinPromptDialog } from "@/components/pin-prompt-dialog"
import { type ChatMessage, storage } from "@/lib/storage"
import { usePinnedPrompts } from "@/hooks/use-chat-storage"

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm Iris, your AI-powered content creation co-pilot. I'm here to help you generate ideas, analyze videos, improve your content, and write scripts or captions. What would you like to work on today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [promptToPin, setPromptToPin] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { addPrompt } = usePinnedPrompts()

  const quickActions = [
    { icon: Sparkles, label: "Generate Ideas", color: "bg-purple-500" },
    { icon: Video, label: "Analyze Video", color: "bg-blue-500" },
    { icon: TrendingUp, label: "Improve Tips", color: "bg-green-500" },
    { icon: FileText, label: "Write Script/Caption", color: "bg-orange-500" },
  ]

  const platformPresets = ["TikTok", "YouTube", "Instagram", "LinkedIn", "Twitter/X"]
  const toneOptions = ["Casual", "Professional", "Funny", "Educational", "Persuasive"]

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    try {
      // Get conversation context (last 10 messages)
      const context = messages.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          context,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Update conversation in storage
      const currentChatId = storage.getCurrentChatId()
      if (currentChatId) {
        const conversations = storage.getChatHistory()
        const currentConversation = conversations.find((conv) => conv.id === currentChatId)
        if (currentConversation) {
          currentConversation.messages = [...messages, userMessage, assistantMessage]
          currentConversation.timestamp = new Date()
          // Update title based on first user message if it's still "New Chat"
          if (currentConversation.title === "New Chat" && userMessage.content.length > 0) {
            currentConversation.title =
              userMessage.content.slice(0, 50) + (userMessage.content.length > 50 ? "..." : "")
          }
          storage.updateConversation(currentChatId, currentConversation)
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handlePinCurrentPrompt = () => {
    if (inputValue.trim()) {
      setPromptToPin(inputValue.trim())
      setShowPinDialog(true)
    }
  }

  const handlePinPrompt = (text: string, category?: string) => {
    addPrompt(text, category)
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Content Creation Chat</h2>
            <p className="text-sm text-muted-foreground">Powered by AI</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              Online
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.length === 1 && (
            <QuickActions
              actions={quickActions}
              onActionClick={(action) => {
                setInputValue(`Help me ${action.toLowerCase()}`)
                textareaRef.current?.focus()
              }}
            />
          )}

          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
              </div>
              <span className="text-sm">Iris is thinking...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Platform & Tone Presets */}
      <div className="border-t border-border p-4">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Platforms:</span>
            {platformPresets.map((platform) => (
              <Badge
                key={platform}
                variant="outline"
                className="cursor-pointer hover:bg-accent text-xs"
                onClick={() => setInputValue((prev) => prev + ` for ${platform}`)}
              >
                {platform}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Tone:</span>
            {toneOptions.map((tone) => (
              <Badge
                key={tone}
                variant="outline"
                className="cursor-pointer hover:bg-accent text-xs"
                onClick={() => setInputValue((prev) => prev + ` in a ${tone.toLowerCase()} tone`)}
              >
                {tone}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (Ctrl+Enter to send)"
              className="min-h-[60px] max-h-[200px] pr-32 resize-none"
              disabled={isLoading}
            />
            <div className="absolute bottom-2 right-2 flex gap-2">
              {inputValue.trim() && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handlePinCurrentPrompt}
                  title="Pin this prompt"
                >
                  <Pin className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isLoading}>
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="h-8 w-8"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">Press Enter for new line, Ctrl+Enter to send</p>
        </div>
      </div>

      <div className="border-t border-border p-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <ContentTemplates
            onTemplateSelect={(prompt) => {
              setInputValue(prompt)
              textareaRef.current?.focus()
            }}
          />
        </div>
      </div>

      <PinPromptDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        onPin={handlePinPrompt}
        initialText={promptToPin}
      />
    </div>
  )
}
