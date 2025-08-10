// 数据库类型定义

export interface Profile {
  id: string
  user_id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  theme: string
  created_at: string
  updated_at: string
}

export interface Link {
  id: string
  user_id: string
  title: string
  url: string
  description: string | null
  icon: string | null
  position: number
  is_active: boolean
  click_count: number
  created_at: string
  updated_at: string
}

export interface AnalyticsEvent {
  id: string
  user_id: string
  event_type: string
  link_id: string | null
  ip_address: string | null
  user_agent: string | null
  referrer: string | null
  created_at: string
}

// API 响应类型
export interface ApiResponse<T = unknown> {
  data: T | null
  error: {
    message: string
    details?: string
  } | null
}

// 组件 Props 类型
export interface LinkCardProps {
  link: Link
  onToggle: (id: string) => void
  onEdit: (link: Link) => void
  onDelete: (id: string) => void
}

// 表单数据类型
export interface LinkFormData {
  title: string
  url: string
  description: string
  icon: string
}

export interface ProfileFormData {
  username: string
  display_name: string
  bio: string
  theme: string
}

// 认证相关类型
export interface AuthError {
  message: string
  status?: number
}

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}