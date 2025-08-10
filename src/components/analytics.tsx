'use client'

import { useEffect } from 'react'

interface AnalyticsProps {
  userId: string
}

export function Analytics({ userId }: AnalyticsProps) {
  useEffect(() => {
    // 记录页面访问事件
    const trackPageView = async () => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id: userId,
            event_type: 'page_view',
            referrer: document.referrer || null,
            user_agent: navigator.userAgent
          })
        })
      } catch (error) {
        console.error('Failed to track page view:', error)
      }
    }

    trackPageView()
  }, [userId])

  return null // 这个组件不渲染任何 UI
}