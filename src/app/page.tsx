import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FaLink, FaChartBar, FaUsers, FaMobile } from 'react-icons/fa'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            打造您的
            <span className="text-purple-600"> Link-in-Bio </span>
            页面
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            一个链接，展示您的所有内容。完全免费，易于使用，专为创作者、影响者和企业设计。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth">
                免费开始
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">
                了解更多
              </Link>
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-20 flex justify-center">
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-auto">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">您的名字</h3>
                <p className="text-gray-600 mb-6">创作者 · 设计师 · 影响者</p>
                
                <div className="space-y-3">
                  {[
                    '我的作品集',
                    '联系方式',
                    '社交媒体',
                    '最新项目'
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span>{item}</span>
                        <FaLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Phone Frame */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full border-8 border-gray-800 rounded-3xl"></div>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            强大功能，简单使用
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            我们提供您需要的所有工具，让您可以专注于创作优质内容。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: FaLink,
              title: '无限链接',
              description: '添加任意数量的链接，完全自定义排序和样式。'
            },
            {
              icon: FaChartBar,
              title: '详细分析',
              description: '了解您的访问者行为，优化内容策略。'
            },
            {
              icon: FaUsers,
              title: '社交登录',
              description: '支持 Google、GitHub 等多种登录方式。'
            },
            {
              icon: FaMobile,
              title: '移动优化',
              description: '完全响应式设计，在任何设备上都完美显示。'
            }
          ].map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <feature.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            准备开始了吗？
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            几分钟内创建您的专属 Link-in-Bio 页面，完全免费！
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50" asChild>
              <Link href="/auth">
                立即注册
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600" asChild>
              <Link href="/demo">
                查看示例
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Link-in-Bio</h3>
            <p className="text-gray-400 mb-6">
              为创作者打造的现代化链接聚合平台
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <Link href="/privacy" className="text-gray-400 hover:text-white">
                隐私政策
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white">
                服务条款
              </Link>
              <Link href="/support" className="text-gray-400 hover:text-white">
                帮助支持
              </Link>
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2024 Link-in-Bio. 保留所有权利。
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}