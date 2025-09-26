"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  RotateCcw,
  Bookmark,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Edit,
  FileText,
  Download,
  Share,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface MessageActionsProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: Date
  }
  onRegenerate?: () => void
  onEdit?: () => void
}

export function MessageActions({ message, onRegenerate, onEdit }: MessageActionsProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      toast({
        title: "Copied to clipboard",
        description: "Message content has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy message content to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: isBookmarked ? "Message removed from your saved items." : "Message saved to your bookmarks.",
    })
  }

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(feedback === type ? null : type)
    toast({
      title: "Feedback recorded",
      description: "Thank you for your feedback! This helps improve Iris.",
    })
  }

  const handleExport = (format: string) => {
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `iris-chat-${timestamp}.${format}`

    let content = message.content
    if (format === "md") {
      content = `# Iris Chat Export\n\n**${message.role === "user" ? "You" : "Iris"}:** ${message.content}\n\n*Exported on ${new Date().toLocaleDateString()}*`
    }

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Export successful",
      description: `Message exported as ${filename}`,
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Iris Chat Message",
          text: message.content,
        })
      } catch (error) {
        handleCopy() // Fallback to copy
      }
    } else {
      handleCopy() // Fallback to copy
    }
  }

  return (
    <div className="flex items-center gap-1">
      {/* Quick actions */}
      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 ${feedback === "up" ? "text-green-600" : ""}`}
        onClick={() => handleFeedback("up")}
      >
        <ThumbsUp className="h-3 w-3" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 ${feedback === "down" ? "text-red-600" : ""}`}
        onClick={() => handleFeedback("down")}
      >
        <ThumbsDown className="h-3 w-3" />
      </Button>

      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
        <Copy className="h-3 w-3" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 ${isBookmarked ? "text-yellow-600" : ""}`}
        onClick={handleBookmark}
      >
        <Bookmark className="h-3 w-3" />
      </Button>

      {/* More actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {message.role === "assistant" && onRegenerate && (
            <DropdownMenuItem onClick={onRegenerate}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Regenerate Response
            </DropdownMenuItem>
          )}

          {message.role === "user" && onEdit && (
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Message
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => handleExport("txt")}>
            <FileText className="h-4 w-4 mr-2" />
            Export as TXT
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => handleExport("md")}>
            <Download className="h-4 w-4 mr-2" />
            Export as Markdown
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share Message
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
