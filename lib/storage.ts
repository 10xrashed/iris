export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  attachments?: any[]
}

export interface ChatConversation {
  id: string
  title: string
  messages: ChatMessage[]
  timestamp: Date
  pinned?: boolean
  tags?: string[]
}

export interface PinnedPrompt {
  id: string
  text: string
  timestamp: Date
  category?: string
}

class StorageManager {
  private static instance: StorageManager
  private readonly CHAT_HISTORY_KEY = "iris-chat-history"
  private readonly PINNED_PROMPTS_KEY = "iris-pinned-prompts"
  private readonly CURRENT_CHAT_KEY = "iris-current-chat"

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  // Chat History Management
  getChatHistory(): ChatConversation[] {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem(this.CHAT_HISTORY_KEY)
      if (!stored) return []
      const parsed = JSON.parse(stored)
      return parsed.map((chat: any) => ({
        ...chat,
        timestamp: new Date(chat.timestamp),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }))
    } catch (error) {
      console.error("Error loading chat history:", error)
      return []
    }
  }

  saveChatHistory(conversations: ChatConversation[]): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(this.CHAT_HISTORY_KEY, JSON.stringify(conversations))
    } catch (error) {
      console.error("Error saving chat history:", error)
    }
  }

  addConversation(conversation: ChatConversation): void {
    const history = this.getChatHistory()
    history.unshift(conversation)
    // Keep only last 50 conversations
    if (history.length > 50) {
      history.splice(50)
    }
    this.saveChatHistory(history)
  }

  updateConversation(id: string, updates: Partial<ChatConversation>): void {
    const history = this.getChatHistory()
    const index = history.findIndex((chat) => chat.id === id)
    if (index !== -1) {
      history[index] = { ...history[index], ...updates }
      this.saveChatHistory(history)
    }
  }

  deleteConversation(id: string): void {
    const history = this.getChatHistory()
    const filtered = history.filter((chat) => chat.id !== id)
    this.saveChatHistory(filtered)
  }

  toggleConversationPin(id: string): void {
    const history = this.getChatHistory()
    const conversation = history.find((chat) => chat.id === id)
    if (conversation) {
      conversation.pinned = !conversation.pinned
      this.saveChatHistory(history)
    }
  }

  // Current Chat Management
  getCurrentChatId(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.CURRENT_CHAT_KEY)
  }

  setCurrentChatId(id: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.CURRENT_CHAT_KEY, id)
  }

  // Pinned Prompts Management
  getPinnedPrompts(): PinnedPrompt[] {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem(this.PINNED_PROMPTS_KEY)
      if (!stored) return []
      const parsed = JSON.parse(stored)
      return parsed.map((prompt: any) => ({
        ...prompt,
        timestamp: new Date(prompt.timestamp),
      }))
    } catch (error) {
      console.error("Error loading pinned prompts:", error)
      return []
    }
  }

  savePinnedPrompts(prompts: PinnedPrompt[]): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(this.PINNED_PROMPTS_KEY, JSON.stringify(prompts))
    } catch (error) {
      console.error("Error saving pinned prompts:", error)
    }
  }

  addPinnedPrompt(text: string, category?: string): void {
    const prompts = this.getPinnedPrompts()
    const newPrompt: PinnedPrompt = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      category,
    }
    prompts.unshift(newPrompt)
    // Keep only last 20 pinned prompts
    if (prompts.length > 20) {
      prompts.splice(20)
    }
    this.savePinnedPrompts(prompts)
  }

  removePinnedPrompt(id: string): void {
    const prompts = this.getPinnedPrompts()
    const filtered = prompts.filter((prompt) => prompt.id !== id)
    this.savePinnedPrompts(filtered)
  }

  // Search functionality
  searchChatHistory(query: string): ChatConversation[] {
    if (!query.trim()) return this.getChatHistory()

    const history = this.getChatHistory()
    const searchTerm = query.toLowerCase()

    return history.filter((conversation) => {
      // Search in title
      if (conversation.title.toLowerCase().includes(searchTerm)) return true

      // Search in tags
      if (conversation.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))) return true

      // Search in message content
      if (conversation.messages.some((msg) => msg.content.toLowerCase().includes(searchTerm))) return true

      return false
    })
  }

  searchPinnedPrompts(query: string): PinnedPrompt[] {
    if (!query.trim()) return this.getPinnedPrompts()

    const prompts = this.getPinnedPrompts()
    const searchTerm = query.toLowerCase()

    return prompts.filter(
      (prompt) => prompt.text.toLowerCase().includes(searchTerm) || prompt.category?.toLowerCase().includes(searchTerm),
    )
  }
}

export const storage = StorageManager.getInstance()
