"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pin, MoreHorizontal, Trash2, Copy, Edit, Plus } from "lucide-react"
import type { PinnedPrompt } from "@/lib/storage"
import { usePinnedPrompts } from "@/hooks/use-chat-storage"
import { PinPromptDialog } from "@/components/pin-prompt-dialog"

interface PinnedPromptsSectionProps {
  onPromptSelect: (prompt: string) => void
  className?: string
}

export function PinnedPromptsSection({ onPromptSelect, className = "" }: PinnedPromptsSectionProps) {
  const { prompts, removePrompt, addPrompt } = usePinnedPrompts()
  const [showPinDialog, setShowPinDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Group prompts by category
  const groupedPrompts = prompts.reduce(
    (acc, prompt) => {
      const category = prompt.category || "Uncategorized"
      if (!acc[category]) acc[category] = []
      acc[category].push(prompt)
      return acc
    },
    {} as Record<string, PinnedPrompt[]>,
  )

  const categories = Object.keys(groupedPrompts).sort()
  const filteredPrompts = selectedCategory ? groupedPrompts[selectedCategory] || [] : prompts

  const handleCopyPrompt = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error("Failed to copy prompt:", error)
    }
  }

  const handleRemovePrompt = (id: string) => {
    removePrompt(id)
  }

  const handlePinPrompt = (text: string, category?: string) => {
    addPrompt(text, category)
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-sidebar-foreground">Pinned Prompts</h3>
        <div className="flex items-center gap-1">
          {categories.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                  {selectedCategory || "All"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSelectedCategory(null)}>All Categories</DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                    {category} ({groupedPrompts[category].length})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowPinDialog(true)}>
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <ScrollArea className="max-h-64">
        <div className="space-y-2">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-6">
              <Pin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No pinned prompts yet</p>
              <Button variant="ghost" size="sm" className="mt-2 text-xs" onClick={() => setShowPinDialog(true)}>
                <Plus className="w-3 h-3 mr-1" />
                Add your first prompt
              </Button>
            </div>
          ) : (
            filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="group p-3 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors border border-transparent hover:border-sidebar-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Pin className="w-3 h-3 text-sidebar-primary flex-shrink-0" />
                    {prompt.category && (
                      <Badge variant="secondary" className="text-xs">
                        {prompt.category}
                      </Badge>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onPromptSelect(prompt.text)}>
                        <Edit className="w-3 h-3 mr-2" />
                        Use Prompt
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyPrompt(prompt.text)}>
                        <Copy className="w-3 h-3 mr-2" />
                        Copy
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRemovePrompt(prompt.id)} className="text-destructive">
                        <Trash2 className="w-3 h-3 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p
                  className="text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground line-clamp-3"
                  onClick={() => onPromptSelect(prompt.text)}
                >
                  {prompt.text}
                </p>

                <p className="text-xs text-sidebar-foreground/50 mt-2">{prompt.timestamp.toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <PinPromptDialog open={showPinDialog} onOpenChange={setShowPinDialog} onPin={handlePinPrompt} />
    </div>
  )
}
