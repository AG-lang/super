import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Metadata } from 'next'
import { Analytics } from '@/components/analytics'
import { LinkCard } from '@/components/link-card'
import { FaExternalLinkAlt } from 'react-icons/fa'
import * as Icons from 'react-icons/fa'
import { Link as LinkType } from '@/types/database'

interface PageProps {
  params: Promise<{
    username: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()
  
  const { data: profiles } = await supabase
    .rpc('get_public_profile', { username_param: username })
  
  const profile = profiles?.[0]

  if (!profile) {
    return {
      title: '用户不存在'
    }
  }

  return {
    title: profile.display_name,
    description: profile.bio || `${profile.display_name} 的 Link-in-Bio 页面`,
    openGraph: {
      title: profile.display_name,
      description: profile.bio || `${profile.display_name} 的 Link-in-Bio 页面`,
      images: profile.avatar_url ? [profile.avatar_url] : undefined,
    }
  }
}

export default async function UserPage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()

  // 获取用户资料
  const { data: profiles, error: profileError } = await supabase
    .rpc('get_public_profile', { username_param: username })
    
  const profile = profiles?.[0]

  if (profileError || !profile) {
    notFound()
  }

  // 获取用户链接
  const { data: links } = await supabase
    .rpc('get_user_links', { username_param: username })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Analytics 组件 */}
      <Analytics userId={profile.id} />
      
      <div className="max-w-md mx-auto px-4 py-12">
        {/* 用户资料 */}
        <div className="text-center mb-8">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="text-2xl">
              {profile.display_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {profile.display_name}
          </h1>
          
          <p className="text-gray-600 mb-1">
            @{profile.username}
          </p>
          
          {profile.bio && (
            <p className="text-gray-700 leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>

        {/* 链接列表 */}
        <div className="space-y-4">
          {links && links.length > 0 ? (
            links.map((link: LinkType) => {
              // 动态导入图标
              const IconComponent = link.icon && Icons[link.icon as keyof typeof Icons] 
                ? Icons[link.icon as keyof typeof Icons] 
                : FaExternalLinkAlt

              return (
                <LinkCard
                  key={link.id}
                  link={link}
                  IconComponent={IconComponent}
                  userId={profile.id}
                />
              )
            })
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">
                  暂无链接
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            使用 Link-in-Bio 创建
          </p>
        </div>
      </div>
    </div>
  )
}

