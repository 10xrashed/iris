"use client"

import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

interface QuickAction {
  icon: LucideIcon
  label: string
  color: string
}

interface QuickActionsProps {
  actions: QuickAction[]
  onActionClick: (label: string) => void
}

export function QuickActions({ actions, onActionClick }: QuickActionsProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">What would you like to create today?</h3>
          <p className="text-sm text-muted-foreground">
            Choose a quick action to get started with your content creation
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-3 hover:scale-105 transition-transform bg-transparent"
                onClick={() => onActionClick(action.label)}
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-center leading-tight">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
