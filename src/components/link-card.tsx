'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FaExternalLinkAlt } from 'react-icons/fa'
import { Link as LinkType } from '@/types/database'

interface LinkCardProps {
  link: LinkType
  IconComponent: React.ComponentType<{ className?: string }>
  userId: string
}

export function LinkCard({ link, IconComponent, userId }: LinkCardProps) {
  const handleClick = async () => {
    // 记录点击事件
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          event_type: 'link_click',
          link_id: link.id
        })
      })
    } catch (error) {
      console.error('Failed to track click:', error)
    }

    // 打开链接
    window.open(link.url, '_blank')
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1">
      <CardContent 
        className="p-6 flex items-center space-x-4"
        onClick={handleClick}
      >
        <div className="flex-shrink-0">
          <IconComponent className="h-6 w-6 text-gray-600" />
        </div>
        
        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {link.title}
          </h3>
          {link.description && (
            <p className="text-sm text-gray-600 truncate">
              {link.description}
            </p>
          )}
        </div>
        
        <div className="flex-shrink-0 flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {link.click_count} 次点击
          </Badge>
          <FaExternalLinkAlt className="h-4 w-4 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  )
}