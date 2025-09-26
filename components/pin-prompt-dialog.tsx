"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Pin, Plus } from "lucide-react"

interface PinPromptDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPin: (text: string, category?: string) => void
  initialText?: string
}

const PROMPT_CATEGORIES = [
  "Content Ideas",
  "Script Writing",
  "Caption Writing",
  "Video Analysis",
  "SEO & Hashtags",
  "Strategy",
  "General",
]

export function PinPromptDialog({ open, onOpenChange, onPin, initialText = "" }: PinPromptDialogProps) {
  const [text, setText] = useState(initialText)
  const [category, setCategory] = useState<string>("")
  const [customCategory, setCustomCategory] = useState("")
  const [showCustomCategory, setShowCustomCategory] = useState(false)

  const handlePin = () => {
    if (!text.trim()) return

    const finalCategory = showCustomCategory && customCategory.trim() ? customCategory.trim() : category || undefined

    onPin(text.trim(), finalCategory)

    // Reset form
    setText("")
    setCategory("")
    setCustomCategory("")
    setShowCustomCategory(false)
    onOpenChange(false)
  }

  const handleCategoryChange = (value: string) => {
    if (value === "custom") {
      setShowCustomCategory(true)
      setCategory("")
    } else {
      setShowCustomCategory(false)
      setCategory(value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pin className="w-4 h-4" />
            Pin Prompt
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt-text">Prompt Text</Label>
            <Textarea
              id="prompt-text"
              placeholder="Enter the prompt you want to pin..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[100px] mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">Category (Optional)</Label>
            <Select value={showCustomCategory ? "custom" : category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {PROMPT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
                <SelectItem value="custom">
                  <div className="flex items-center gap-2">
                    <Plus className="w-3 h-3" />
                    Custom Category
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showCustomCategory && (
            <div>
              <Label htmlFor="custom-category">Custom Category</Label>
              <Input
                id="custom-category"
                placeholder="Enter custom category name"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePin} disabled={!text.trim()}>
            <Pin className="w-4 h-4 mr-2" />
            Pin Prompt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
