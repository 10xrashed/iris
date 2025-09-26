"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Video, TrendingUp, FileText, Hash, Zap, Clock, Star } from "lucide-react"
import { usePinnedPrompts } from "@/hooks/use-chat-storage"

interface QuickAccessPanelProps {
  onPromptSelect: (prompt: string) => void
  onActionSelect: (action: string) => void
  className?: string
}

const QUICK_ACTIONS = [
  {
    id: "generate-ideas",
    label: "Generate Ideas",
    icon: Sparkles,
    color: "bg-purple-500",
    prompt: "Generate 10 creative content ideas for",
  },
  {
    id: "analyze-video",
    label: "Analyze Video",
    icon: Video,
    color: "bg-blue-500",
    prompt: "Analyze this video and provide improvement suggestions",
  },
  {
    id: "improve-content",
    label: "Improve Content",
    icon: TrendingUp,
    color: "bg-green-500",
    prompt: "Help me improve this content to make it more engaging",
  },
  {
    id: "write-script",
    label: "Write Script",
    icon: FileText,
    color: "bg-orange-500",
    prompt: "Write a compelling script for",
  },
]

const TRENDING_PROMPTS = [
  "Create a viral TikTok hook for cooking content",
  "Write Instagram captions that drive engagement",
  "Generate YouTube video titles for tech reviews",
  "Create LinkedIn posts for personal branding",
  "Write Twitter threads about productivity",
]

export function QuickAccessPanel({ onPromptSelect, onActionSelect, className = "" }: QuickAccessPanelProps) {
  const { prompts } = usePinnedPrompts()
  const [activeSection, setActiveSection] = useState<"actions" | "pinned" | "trending">("actions")

  // Get most recently used pinned prompts
  const recentPinnedPrompts = prompts.slice(0, 5)

  const handleActionClick = (action: (typeof QUICK_ACTIONS)[0]) => {
    onActionSelect(action.id)
    onPromptSelect(action.prompt)
  }

  return (
    <Card className={`${className} border-0 shadow-none bg-muted/30`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Quick Access
        </CardTitle>

        <div className="flex gap-1">
          <Button
            variant={activeSection === "actions" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSection("actions")}
            className="text-xs h-7"
          >
            Actions
          </Button>
          <Button
            variant={activeSection === "pinned" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSection("pinned")}
            className="text-xs h-7"
          >
            Pinned ({recentPinnedPrompts.length})
          </Button>
          <Button
            variant={activeSection === "trending" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveSection("trending")}
            className="text-xs h-7"
          >
            Trending
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea className="h-48">
          {activeSection === "actions" && (
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.id}
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-accent transition-colors bg-transparent"
                    onClick={() => handleActionClick(action)}
                  >
                    <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-center">{action.label}</span>
                  </Button>
                )
              })}
            </div>
          )}

          {activeSection === "pinned" && (
            <div className="space-y-2">
              {recentPinnedPrompts.length === 0 ? (
                <div className="text-center py-6">
                  <Star className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No pinned prompts yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Pin your favorite prompts for quick access</p>
                </div>
              ) : (
                recentPinnedPrompts.map((prompt) => (
                  <Button
                    key={prompt.id}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-3 hover:bg-accent"
                    onClick={() => onPromptSelect(prompt.text)}
                  >
                    <div className="flex items-start gap-2 w-full">
                      <Star className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2">{prompt.text}</p>
                        {prompt.category && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            {prompt.category}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {prompt.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                  </Button>
                ))
              )}
            </div>
          )}

          {activeSection === "trending" && (
            <div className="space-y-2">
              {TRENDING_PROMPTS.map((prompt, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto p-3 hover:bg-accent"
                  onClick={() => onPromptSelect(prompt)}
                >
                  <div className="flex items-start gap-2 w-full">
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium text-primary">#{index + 1}</span>
                    </div>
                    <p className="text-sm flex-1">{prompt}</p>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
