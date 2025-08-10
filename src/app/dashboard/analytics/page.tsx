'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { FaEye, FaMousePointer, FaCalendarAlt, FaExternalLinkAlt } from 'react-icons/fa'

interface AnalyticsData {
  totalViews: number
  totalClicks: number
  topLinks: Array<{
    title: string
    clicks: number
    url: string
  }>
  dailyViews: Array<{
    date: string
    views: number
    clicks: number
  }>
  linkClicksData: Array<{
    name: string
    value: number
  }>
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    totalClicks: 0,
    topLinks: [],
    dailyViews: [],
    linkClicksData: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user])

  const fetchAnalytics = async () => {
    if (!user) return

    setIsLoading(true)
    
    try {
      // 获取总访问量
      const { count: totalViews } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('event_type', 'page_view')

      // 获取总点击量
      const { count: totalClicks } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('event_type', 'link_click')

      // 获取最受欢迎的链接
      const { data: links } = await supabase
        .from('links')
        .select('title, url, click_count')
        .eq('user_id', user.id)
        .order('click_count', { ascending: false })
        .limit(5)

      const topLinks = (links || []).map(link => ({
        title: link.title,
        clicks: link.click_count,
        url: link.url
      }))

      // 获取最近7天的数据
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toISOString().split('T')[0]
      }).reverse()

      const dailyViews = await Promise.all(
        last7Days.map(async (date) => {
          const { count: views } = await supabase
            .from('analytics_events')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('event_type', 'page_view')
            .gte('created_at', `${date}T00:00:00`)
            .lt('created_at', `${date}T23:59:59`)

          const { count: clicks } = await supabase
            .from('analytics_events')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('event_type', 'link_click')
            .gte('created_at', `${date}T00:00:00`)
            .lt('created_at', `${date}T23:59:59`)

          return {
            date: new Date(date).toLocaleDateString('zh-CN', { 
              month: 'short', 
              day: 'numeric' 
            }),
            views: views || 0,
            clicks: clicks || 0
          }
        })
      )

      // 链接点击分布数据
      const linkClicksData = topLinks.map((link) => ({
        name: link.title.length > 15 ? link.title.substring(0, 15) + '...' : link.title,
        value: link.clicks
      })).filter(item => item.value > 0)

      setAnalytics({
        totalViews: totalViews || 0,
        totalClicks: totalClicks || 0,
        topLinks,
        dailyViews,
        linkClicksData
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">分析数据</h1>
            <p className="text-gray-600">查看您的页面访问量和链接点击统计</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                返回仪表盘
              </Link>
            </Button>
          </div>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                总访问量
              </CardTitle>
              <FaEye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalViews}</div>
              <p className="text-xs text-muted-foreground">
                页面被访问的总次数
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                总点击量
              </CardTitle>
              <FaMousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalClicks}</div>
              <p className="text-xs text-muted-foreground">
                链接被点击的总次数
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                点击率
              </CardTitle>
              <FaCalendarAlt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.totalViews > 0 
                  ? `${((analytics.totalClicks / analytics.totalViews) * 100).toFixed(1)}%`
                  : '0%'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                访问转化为点击的比率
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 最近7天趋势 */}
          <Card>
            <CardHeader>
              <CardTitle>最近7天趋势</CardTitle>
              <CardDescription>
                页面访问量和链接点击量的趋势变化
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.dailyViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#8884d8" 
                    name="访问量"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#82ca9d" 
                    name="点击量"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 链接点击分布 */}
          <Card>
            <CardHeader>
              <CardTitle>链接点击分布</CardTitle>
              <CardDescription>
                各链接的点击量分布情况
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.linkClicksData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.linkClicksData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.linkClicksData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-300 flex items-center justify-center">
                  <p className="text-gray-500">暂无点击数据</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 热门链接 */}
        <Card>
          <CardHeader>
            <CardTitle>热门链接</CardTitle>
            <CardDescription>
              点击量最高的前5个链接
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topLinks.length > 0 ? (
              <div className="space-y-4">
                {analytics.topLinks.map((link, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-semibold text-gray-500">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{link.title}</h3>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {link.url}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-semibold">{link.clicks}</div>
                        <div className="text-sm text-gray-500">点击</div>
                      </div>
                      <FaExternalLinkAlt className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">暂无链接数据</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}