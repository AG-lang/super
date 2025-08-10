import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-red-600">
            认证失败
          </CardTitle>
          <CardDescription className="text-center">
            抱歉，认证过程中出现了错误
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 text-center">
            <p>可能的原因：</p>
            <ul className="mt-2 space-y-1 text-left">
              <li>• 认证链接已过期</li>
              <li>• 认证链接已被使用</li>
              <li>• 网络连接问题</li>
            </ul>
          </div>
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/auth">
                重新登录
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                返回首页
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}