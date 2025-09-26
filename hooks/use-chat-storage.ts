"use client"

import { useState, useEffect, useCallback } from "react"
import { storage, type ChatConversation, type PinnedPrompt } from "@/lib/storage"

export function useChatHistory() {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [loading, setLoading] = useState(true)

  const loadHistory = useCallback(() => {
    setLoading(true)
    const history = storage.getChatHistory()
    setConversations(history)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const addConversation = useCallback(
    (conversation: ChatConversation) => {
      storage.addConversation(conversation)
      loadHistory()
    },
    [loadHistory],
  )

  const updateConversation = useCallback(
    (id: string, updates: Partial<ChatConversation>) => {
      storage.updateConversation(id, updates)
      loadHistory()
    },
    [loadHistory],
  )

  const deleteConversation = useCallback(
    (id: string) => {
      storage.deleteConversation(id)
      loadHistory()
    },
    [loadHistory],
  )

  const togglePin = useCallback(
    (id: string) => {
      storage.toggleConversationPin(id)
      loadHistory()
    },
    [loadHistory],
  )

  return {
    conversations,
    loading,
    addConversation,
    updateConversation,
    deleteConversation,
    togglePin,
    refresh: loadHistory,
  }
}

export function usePinnedPrompts() {
  const [prompts, setPrompts] = useState<PinnedPrompt[]>([])
  const [loading, setLoading] = useState(true)

  const loadPrompts = useCallback(() => {
    setLoading(true)
    const pinnedPrompts = storage.getPinnedPrompts()
    setPrompts(pinnedPrompts)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadPrompts()
  }, [loadPrompts])

  const addPrompt = useCallback(
    (text: string, category?: string) => {
      storage.addPinnedPrompt(text, category)
      loadPrompts()
    },
    [loadPrompts],
  )

  const removePrompt = useCallback(
    (id: string) => {
      storage.removePinnedPrompt(id)
      loadPrompts()
    },
    [loadPrompts],
  )

  return {
    prompts,
    loading,
    addPrompt,
    removePrompt,
    refresh: loadPrompts,
  }
}

export function useCurrentChat() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  useEffect(() => {
    const id = storage.getCurrentChatId()
    setCurrentChatId(id)
  }, [])

  const setCurrentChat = useCallback((id: string) => {
    storage.setCurrentChatId(id)
    setCurrentChatId(id)
  }, [])

  return {
    currentChatId,
    setCurrentChat,
  }
}

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<{
    conversations: ChatConversation[]
    prompts: PinnedPrompt[]
  }>({ conversations: [], prompts: [] })

  const performSearch = useCallback((query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults({ conversations: [], prompts: [] })
      return
    }

    const conversations = storage.searchChatHistory(query)
    const prompts = storage.searchPinnedPrompts(query)

    setSearchResults({ conversations, prompts })
  }, [])

  return {
    searchQuery,
    searchResults,
    performSearch,
    clearSearch: () => {
      setSearchQuery("")
      setSearchResults({ conversations: [], prompts: [] })
    },
  }
}
