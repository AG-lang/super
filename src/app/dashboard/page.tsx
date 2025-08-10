'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { Profile, ProfileFormData } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
    theme: ''
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        theme: profile.theme || 'system'
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: formData.username,
          display_name: formData.display_name,
          bio: formData.bio,
          theme: formData.theme
        })

      if (error) throw error
      setMessage('资料保存成功！')
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
            <p className="text-gray-600">管理您的个人资料和链接</p>
          </div>
          <div className="flex space-x-2">
            {formData.username && (
              <Button variant="outline" asChild>
                <Link href={`/${formData.username}`}>
                  查看页面
                </Link>
              </Button>
            )}
            <Button variant="outline" onClick={handleSignOut}>
              退出登录
            </Button>
          </div>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>个人资料</CardTitle>
            <CardDescription>
              设置您的公开个人资料信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback>
                    {formData.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    头像上传功能将在后续版本中添加
                  </p>
                </div>
              </div>

              {/* Username */}
              <div>
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="your-username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  这将是您的公开 URL：{window.location.origin}/{formData.username}
                </p>
              </div>

              {/* Display Name */}
              <div>
                <Label htmlFor="display_name">显示名称</Label>
                <Input
                  id="display_name"
                  type="text"
                  placeholder="Your Display Name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio">个人简介</Label>
                <Textarea
                  id="bio"
                  placeholder="介绍一下自己..."
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <Button type="submit" disabled={saving} className="w-full">
                {saving ? '保存中...' : '保存资料'}
              </Button>

              {message && (
                <div className={`text-sm p-3 rounded ${
                  message.includes('成功') 
                    ? 'text-green-700 bg-green-50' 
                    : 'text-red-700 bg-red-50'
                }`}>
                  {message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">链接管理</h3>
              <p className="text-sm text-gray-600 mb-4">
                添加、编辑和排序您的链接
              </p>
              <Button asChild>
                <Link href="/dashboard/links">
                  管理链接
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">分析数据</h3>
              <p className="text-sm text-gray-600 mb-4">
                查看访问量和点击统计
              </p>
              <Button asChild>
                <Link href="/dashboard/analytics">
                  查看分析
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}