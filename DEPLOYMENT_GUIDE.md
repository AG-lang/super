# Vercel 部署指南

您的 Link-in-Bio 项目已经成功推送到 GitHub 仓库：
https://github.com/AG-lang/super.git

现在请按照以下步骤完成 Vercel 部署：

## 方法一：通过 Vercel 网站部署（推荐）

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账户登录
3. 点击 "New Project"
4. 从 GitHub 导入您的仓库：`AG-lang/super`
5. 项目设置：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (默认)
   - **Build Command**: `pnpm build` (自动检测)
   - **Output Directory**: `.next` (自动检测)

6. 环境变量配置：
   点击 "Environment Variables" 添加以下变量：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

7. 点击 "Deploy" 开始部署

## 方法二：通过 CLI 部署

如果您想使用 CLI 部署，请在项目目录下运行：

```bash
cd "D:\aStudy\supabase_vercel\link-bio"
vercel login
vercel
```

然后按提示配置项目。

## 部署后配置

### Supabase 配置更新

部署成功后，您需要在 Supabase 项目中更新以下配置：

1. **Site URL**: 在 Supabase Dashboard > Authentication > URL Configuration 中：
   - Site URL: `https://your-vercel-app.vercel.app`

2. **OAuth 重定向 URL**: 
   - Redirect URLs: `https://your-vercel-app.vercel.app/auth/callback`

3. **CORS 配置**: 确保您的 Vercel 域名在 CORS 允许列表中

### 自定义域名（可选）

如果您有自定义域名：
1. 在 Vercel Dashboard > Project > Settings > Domains
2. 添加您的域名
3. 更新 Supabase 中的 Site URL 和 Redirect URLs

## 验证部署

部署完成后，请测试以下功能：
- [ ] 首页加载正常
- [ ] 用户注册/登录
- [ ] OAuth 登录（Google/GitHub）
- [ ] Dashboard 功能
- [ ] 公开页面访问
- [ ] 链接点击统计

## 故障排除

如果遇到部署问题：

1. **构建失败**: 检查依赖项和 TypeScript 错误
2. **环境变量**: 确保所有必需的环境变量都已设置
3. **Supabase 连接**: 验证 Supabase URL 和密钥是否正确
4. **域名配置**: 确保 Supabase 中的 URL 配置与部署域名匹配

## 监控和维护

- 使用 Vercel Analytics 监控应用性能
- 定期检查 Supabase 使用情况和配额
- 备份数据库数据

---

您的项目现在已经准备好部署！🚀