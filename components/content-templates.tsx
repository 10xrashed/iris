"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Video, TrendingUp, FileText, Hash, Camera, Clock, Users } from "lucide-react"

interface Template {
  id: string
  title: string
  description: string
  prompt: string
  category: string
  platform: string[]
  icon: React.ComponentType<{ className?: string }>
}

interface ContentTemplatesProps {
  onTemplateSelect: (prompt: string) => void
}

export function ContentTemplates({ onTemplateSelect }: ContentTemplatesProps) {
  const templates: Template[] = [
    {
      id: "video-ideas",
      title: "Viral Video Ideas",
      description: "Generate trending video concepts for any niche",
      prompt:
        "Generate 10 short-form video concepts for [topic]. Each idea: 1-line hook, suggested duration, 2 quick tags, and a 10-word caption.",
      category: "ideas",
      platform: ["TikTok", "YouTube", "Instagram"],
      icon: Sparkles,
    },
    {
      id: "video-analysis",
      title: "Video Performance Analysis",
      description: "Analyze video content and suggest improvements",
      prompt:
        "Analyze this clip: give 5 timestamped notes (hook, pacing, best cut points), top 3 thumbnail frames, and 10-word improved caption.",
      category: "analysis",
      platform: ["YouTube", "TikTok"],
      icon: Video,
    },
    {
      id: "script-writing",
      title: "Engaging Script Writer",
      description: "Create attention-grabbing scripts for any platform",
      prompt:
        "Write an attention-grabbing 45-second script for [platform]. Include 3 alternative hooks and a short CTA.",
      category: "scripts",
      platform: ["TikTok", "YouTube", "Instagram"],
      icon: FileText,
    },
    {
      id: "hashtag-research",
      title: "SEO Hashtag Generator",
      description: "Research trending hashtags and optimize discoverability",
      prompt:
        "Generate 30 hashtags for [topic] content: 10 trending, 10 niche-specific, 10 long-tail. Include engagement potential and competition level.",
      category: "seo",
      platform: ["Instagram", "TikTok", "LinkedIn"],
      icon: Hash,
    },
    {
      id: "thumbnail-ideas",
      title: "Thumbnail Concepts",
      description: "Design compelling thumbnail ideas that drive clicks",
      prompt:
        "Create 5 thumbnail concepts for [video topic]: describe visual elements, text overlay, color scheme, and emotional appeal for maximum CTR.",
      category: "design",
      platform: ["YouTube"],
      icon: Camera,
    },
    {
      id: "content-calendar",
      title: "Content Calendar Planner",
      description: "Plan consistent content across multiple platforms",
      prompt:
        "Create a 7-day content calendar for [niche]: daily post ideas, optimal posting times, platform-specific adaptations, and engagement strategies.",
      category: "planning",
      platform: ["All Platforms"],
      icon: Clock,
    },
    {
      id: "audience-analysis",
      title: "Audience Insights",
      description: "Understand your audience and create targeted content",
      prompt:
        "Analyze my [platform] audience for [niche]: demographics, interests, pain points, content preferences, and 5 content ideas that would resonate.",
      category: "analysis",
      platform: ["All Platforms"],
      icon: Users,
    },
    {
      id: "trend-adaptation",
      title: "Trend Adaptation",
      description: "Adapt trending content to your niche",
      prompt:
        "Take this trending [platform] format/sound and adapt it for [your niche]: 3 creative variations, timing strategy, and hashtag recommendations.",
      category: "trends",
      platform: ["TikTok", "Instagram"],
      icon: TrendingUp,
    },
  ]

  const categories = [
    { id: "all", label: "All Templates" },
    { id: "ideas", label: "Content Ideas" },
    { id: "scripts", label: "Scripts & Copy" },
    { id: "analysis", label: "Analysis" },
    { id: "seo", label: "SEO & Growth" },
    { id: "design", label: "Visual Design" },
    { id: "planning", label: "Planning" },
    { id: "trends", label: "Trends" },
  ]

  const [activeCategory, setActiveCategory] = useState("all")

  const filteredTemplates =
    activeCategory === "all" ? templates : templates.filter((template) => template.category === activeCategory)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Content Creator Templates</h3>
        <p className="text-sm text-muted-foreground">Choose a template to get started with professional prompts</p>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const Icon = template.icon
              return (
                <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-sm font-medium">{template.title}</CardTitle>
                        <CardDescription className="text-xs mt-1">{template.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.platform.map((platform) => (
                        <Badge key={platform} variant="secondary" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                    <Button onClick={() => onTemplateSelect(template.prompt)} className="w-full text-xs" size="sm">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
