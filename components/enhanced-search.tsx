"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useSearch } from "@/hooks/use-chat-storage"
import { SearchResults } from "@/components/search-results"
import type { ChatConversation, PinnedPrompt } from "@/lib/storage"

interface EnhancedSearchProps {
  onConversationSelect: (conversation: ChatConversation) => void
  onPromptSelect: (prompt: PinnedPrompt) => void
  placeholder?: string
  className?: string
}

export function EnhancedSearch({
  onConversationSelect,
  onPromptSelect,
  placeholder = "Search chats and prompts...",
  className = "",
}: EnhancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const { searchQuery, searchResults, performSearch, clearSearch } = useSearch()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(inputValue)
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue, performSearch])

  // Handle clicks outside to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setIsOpen(value.length > 0)
  }

  const handleClear = () => {
    setInputValue("")
    clearSearch()
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleConversationSelect = (conversation: ChatConversation) => {
    onConversationSelect(conversation)
    setIsOpen(false)
    setInputValue("")
    clearSearch()
  }

  const handlePromptSelect = (prompt: PinnedPrompt) => {
    onPromptSelect(prompt)
    setIsOpen(false)
    setInputValue("")
    clearSearch()
  }

  const hasResults = searchResults.conversations.length > 0 || searchResults.prompts.length > 0

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.length > 0 && setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={handleClear}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {isOpen && inputValue && (
        <SearchResults
          conversations={searchResults.conversations}
          prompts={searchResults.prompts}
          searchQuery={searchQuery}
          onConversationSelect={handleConversationSelect}
          onPromptSelect={handlePromptSelect}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
