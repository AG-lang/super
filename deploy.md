# 部署指南

## 🚀 Vercel 部署步骤

### 方法一：使用 Vercel CLI（推荐）

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   在项目根目录运行：
   ```bash
   vercel
   ```

4. **添加环境变量**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

5. **重新部署**
   ```bash
   vercel --prod
   ```

### 方法二：GitHub 集成

1. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **在 Vercel 导入项目**
   - 访问 [vercel.com/new](https://vercel.com/new)
   - 选择你的 GitHub 仓库
   - 点击 "Import"

3. **配置环境变量**
   在 Vercel 项目设置页面添加：
   - `NEXT_PUBLIC_SUPABASE_URL`: 你的 Supabase 项目 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 你的 Supabase 匿名密钥

4. **部署完成**
   Vercel 会自动构建和部署你的项目

## 🗄️ Supabase 设置

### 1. 创建 Supabase 项目

1. 访问 [supabase.com](https://supabase.com)
2. 点击 "New project"
3. 填写项目信息并创建

### 2. 设置数据库

1. 进入项目后，点击 "SQL Editor"
2. 复制 `database/schema.sql` 文件中的所有内容
3. 粘贴到 SQL 编辑器中并执行

### 3. 获取 API 密钥

1. 进入项目设置 > API
2. 复制以下信息：
   - Project URL
   - anon public key

### 4. 配置认证提供商（可选）

如果要使用 Google/GitHub 登录：

1. 进入 Authentication > Settings
2. 在 "Auth Providers" 部分配置：
   - **Google**: 添加 Client ID 和 Client Secret
   - **GitHub**: 添加 Client ID 和 Client Secret

## 🔧 构建验证

在部署前，确保项目能够正确构建：

```bash
pnpm build
```

如果构建成功，你会看到类似输出：
```
✓ Compiled successfully in 5.2s
```

## 🌐 域名设置（可选）

### 使用自定义域名

1. 在 Vercel 项目设置中点击 "Domains"
2. 添加你的自定义域名
3. 根据提示配置 DNS 记录

### 添加 www 重定向

添加以下 DNS 记录：
- `A` 记录：`@` → `76.76.19.61`
- `CNAME` 记录：`www` → `cname.vercel-dns.com`

## 📊 监控和分析

### Vercel Analytics（推荐）

1. 在 Vercel 项目设置中启用 Analytics
2. 查看实时访问数据和性能指标

### 自定义分析

项目已内置简单的分析功能：
- 页面访问统计
- 链接点击统计
- 用户行为分析

## 🔒 安全设置

### RLS 策略验证

确保以下 RLS 策略已正确设置：

1. **profiles 表**：用户只能查看和编辑自己的资料
2. **links 表**：用户只能管理自己的链接
3. **analytics_events 表**：用户只能查看自己的分析数据

### 环境变量安全

- 不要在代码中硬编码 API 密钥
- 使用 Vercel 环境变量管理敏感信息
- 定期轮换 API 密钥

## 🚨 故障排除

### 构建失败

1. **检查环境变量**：确保所有必需的环境变量都已设置
2. **查看构建日志**：在 Vercel 仪表盘中查看详细错误信息
3. **本地测试**：运行 `pnpm build` 确保本地构建成功

### 数据库连接问题

1. **检查 Supabase URL**：确保 URL 格式正确
2. **验证 API 密钥**：确保使用正确的匿名密钥
3. **检查 RLS 策略**：确保数据库策略允许必要的操作

### 认证问题

1. **检查重定向 URL**：在 Supabase 认证设置中添加生产域名
2. **OAuth 配置**：确保第三方登录配置正确
3. **HTTPS 要求**：确保生产环境使用 HTTPS

## 📞 获取帮助

如果遇到问题：

1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 查看 [Supabase 文档](https://supabase.com/docs)
3. 在 GitHub 项目中创建 Issue