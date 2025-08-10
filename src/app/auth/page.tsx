'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import { AuthError as AuthErrorType } from '@supabase/supabase-js'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        setMessage('登录成功！')
        router.push('/dashboard')
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setMessage('注册成功！请查看邮箱验证邮件。')
      }
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : '操作失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
      })
      if (error) throw error
      setMessage('Magic Link 已发送到您的邮箱！')
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : '操作失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : '操作失败')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            {isLogin ? '登录' : '注册'}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin 
              ? '欢迎回来！请登录您的账户' 
              : '创建您的 Link-in-Bio 账户'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* OAuth 登录按钮 */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading}
            >
              <FaGoogle className="mr-2 h-4 w-4" />
              使用 Google 登录
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleOAuthLogin('github')}
              disabled={isLoading}
            >
              <FaGithub className="mr-2 h-4 w-4" />
              使用 GitHub 登录
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                或者
              </span>
            </div>
          </div>

          {/* 邮箱密码表单 */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {(isLogin || !isLogin) && (
              <div>
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={isLogin}
                  minLength={6}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '处理中...' : (isLogin ? '登录' : '注册')}
            </Button>
          </form>

          {/* Magic Link */}
          {email && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleMagicLink}
              disabled={isLoading}
            >
              发送 Magic Link
            </Button>
          )}

          {/* 切换登录/注册模式 */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              disabled={isLoading}
            >
              {isLogin ? '还没有账户？点击注册' : '已有账户？点击登录'}
            </Button>
          </div>

          {/* 消息显示 */}
          {message && (
            <div className={`text-sm p-3 rounded ${
              message.includes('成功') 
                ? 'text-green-700 bg-green-50' 
                : 'text-red-700 bg-red-50'
            }`}>
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}