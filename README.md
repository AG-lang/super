# Link-in-Bio 个人展示项目

这是一个现代化的 Link-in-Bio 个人展示项目，使用 Next.js 14、Supabase 和 Tailwind CSS 构建。

## ✨ 功能特性

- 🔐 **用户认证系统** - 邮箱/密码、Magic Link、OAuth (Google, GitHub)
- 👤 **个人资料管理** - 用户名、显示名称、个人简介、头像
- 🔗 **链接管理** - CRUD 操作、拖拽排序、启用/禁用
- 📊 **数据分析** - 页面访问量、链接点击统计、图表展示
- 🎨 **响应式设计** - 移动端友好的界面
- 🚀 **SEO 优化** - 使用 Next.js 14 Metadata API
- 🌐 **公开页面** - 访问地址: `/[username]`

## 🛠️ 技术栈

- **前端框架**: Next.js 14 (App Router)
- **前端部署**: Vercel
- **后端服务**: Supabase (PostgreSQL + Auth + Storage)
- **样式方案**: Tailwind CSS + Shadcn/ui 组件库
- **类型安全**: TypeScript 严格模式
- **图表组件**: Recharts
- **拖拽功能**: @dnd-kit
- **图标库**: React Icons

## 📋 项目设置

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd link-bio
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 环境变量配置

复制环境变量示例文件：

```bash
cp .env.local.example .env.local
```

在 `.env.local` 文件中填入你的 Supabase 项目信息：

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Supabase 数据库设置

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 在 SQL 编辑器中执行 `database/schema.sql` 文件中的 SQL 脚本
3. 设置 RLS 策略和权限
4. 配置 OAuth 提供商（可选）

### 5. 本地开发

```bash
pnpm dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 🚀 部署到 Vercel

### 使用 Vercel CLI

1. 安装 Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. 登录并部署:
   ```bash
   vercel
   ```

3. 在 Vercel 项目设置中添加环境变量:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 使用 Git 集成

1. 将项目推送到 GitHub/GitLab
2. 在 [Vercel Dashboard](https://vercel.com/dashboard) 导入项目
3. 添加环境变量
4. 自动部署

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── auth/              # 认证页面
│   ├── dashboard/         # 仪表盘页面
│   ├── [username]/        # 动态用户页面
│   └── layout.tsx         # 根布局
├── components/            # React 组件
│   └── ui/               # Shadcn/ui 组件
├── hooks/                # 自定义 Hooks
├── lib/                  # 工具库
│   └── supabase/         # Supabase 客户端配置
└── types/                # TypeScript 类型定义

database/
└── schema.sql            # 数据库架构

docs/                     # 技术文档
├── nextjs-app-router.md
├── supabase-rls.md
├── supabase-auth-client.md
└── vercel-environment-variables.md
```

## 🗄️ 数据库架构

- **profiles** - 用户资料信息
- **links** - 用户链接数据
- **analytics_events** - 分析事件记录

详细的数据库架构请查看 `database/schema.sql` 文件。

## 🔧 开发命令

```bash
# 开发
pnpm dev

# 构建
pnpm build

# 启动生产服务器
pnpm start

# 类型检查
pnpm type-check

# 代码检查
pnpm lint
```

## 📚 文档

项目包含以下技术文档：

- [Next.js App Router 文档](docs/nextjs-app-router.md)
- [Supabase RLS 文档](docs/supabase-rls.md)
- [Supabase Auth Client 文档](docs/supabase-auth-client.md)
- [Vercel Environment Variables 文档](docs/vercel-environment-variables.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🔗 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Shadcn/ui 文档](https://ui.shadcn.com)
- [Vercel 文档](https://vercel.com/docs)