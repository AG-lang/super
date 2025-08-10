'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { Link as LinkType, LinkFormData } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaGripVertical, FaEye, FaEyeSlash } from 'react-icons/fa'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function LinksPage() {
  const { user, loading } = useAuth()
  const [links, setLinks] = useState<LinkType[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<LinkType | null>(null)
  const [formData, setFormData] = useState<LinkFormData>({
    title: '',
    url: '',
    description: '',
    icon: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchLinks()
    }
  }, [user])

  const fetchLinks = async () => {
    if (!user) return

    const { data } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', user.id)
      .order('position', { ascending: true })

    if (data) {
      setLinks(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)

    try {
      if (editingLink) {
        // 更新链接
        const { error } = await supabase
          .from('links')
          .update({
            title: formData.title,
            url: formData.url,
            description: formData.description,
            icon: formData.icon
          })
          .eq('id', editingLink.id)

        if (error) throw error
      } else {
        // 创建新链接
        const maxPosition = Math.max(...links.map(l => l.position), -1)
        const { error } = await supabase
          .from('links')
          .insert({
            user_id: user.id,
            title: formData.title,
            url: formData.url,
            description: formData.description,
            icon: formData.icon,
            position: maxPosition + 1
          })

        if (error) throw error
      }

      // 重新获取链接
      await fetchLinks()
      
      // 重置表单
      setFormData({ title: '', url: '', description: '', icon: '' })
      setEditingLink(null)
      setIsDialogOpen(false)
    } catch (error: unknown) {
      console.error('Error saving link:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (link: LinkType) => {
    setEditingLink(link)
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description || '',
      icon: link.icon || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (linkId: string) => {
    if (!confirm('确定要删除这个链接吗？')) return

    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId)

    if (!error) {
      await fetchLinks()
    }
  }

  const handleToggleActive = async (link: LinkType) => {
    const { error } = await supabase
      .from('links')
      .update({ is_active: !link.is_active })
      .eq('id', link.id)

    if (!error) {
      await fetchLinks()
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((item) => item.id === active.id)
      const newIndex = links.findIndex((item) => item.id === over.id)

      const newLinks = arrayMove(links, oldIndex, newIndex)
      setLinks(newLinks)

      // 更新数据库中的位置
      const updates = newLinks.map((link, index) => ({
        id: link.id,
        position: index
      }))

      for (const update of updates) {
        await supabase
          .from('links')
          .update({ position: update.position })
          .eq('id', update.id)
      }
    }
  }

  const openNewLinkDialog = () => {
    setEditingLink(null)
    setFormData({ title: '', url: '', description: '', icon: '' })
    setIsDialogOpen(true)
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">链接管理</h1>
            <p className="text-gray-600">添加、编辑和排序您的链接</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                返回仪表盘
              </Link>
            </Button>
          </div>
        </div>

        {/* Add Link Button */}
        <div className="mb-6">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewLinkDialog}>
                <FaPlus className="mr-2 h-4 w-4" />
                添加新链接
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingLink ? '编辑链接' : '添加新链接'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">标题</Label>
                  <Input
                    id="title"
                    placeholder="链接标题"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">描述（可选）</Label>
                  <Textarea
                    id="description"
                    placeholder="链接描述"
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="icon">图标（可选）</Label>
                  <Input
                    id="icon"
                    placeholder="FaGithub, FaTwitter, etc."
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    使用 React Icons (Fa*) 的图标名称
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? '保存中...' : '保存'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    取消
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Links List */}
        <Card>
          <CardHeader>
            <CardTitle>您的链接</CardTitle>
            <CardDescription>
              拖拽以重新排序，点击眼睛图标以切换可见性
            </CardDescription>
          </CardHeader>
          <CardContent>
            {links.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">还没有添加任何链接</p>
                <Button onClick={openNewLinkDialog}>
                  <FaPlus className="mr-2 h-4 w-4" />
                  添加第一个链接
                </Button>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={links.map(link => link.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {links.map((link) => (
                      <SortableLinkItem
                        key={link.id}
                        link={link}
                        onEdit={() => handleEdit(link)}
                        onDelete={() => handleDelete(link.id)}
                        onToggleActive={() => handleToggleActive(link)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface SortableLinkItemProps {
  link: LinkType
  onEdit: () => void
  onDelete: () => void
  onToggleActive: () => void
}

function SortableLinkItem({ link, onEdit, onDelete, onToggleActive }: SortableLinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-4 p-4 border rounded-lg bg-white"
    >
      <div {...attributes} {...listeners} className="cursor-grab">
        <FaGripVertical className="h-4 w-4 text-gray-400" />
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium truncate">{link.title}</h3>
          {!link.is_active && (
            <Badge variant="secondary">隐藏</Badge>
          )}
        </div>
        <p className="text-sm text-gray-500 truncate">{link.url}</p>
        {link.description && (
          <p className="text-sm text-gray-600 truncate">{link.description}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-xs">
          {link.click_count} 点击
        </Badge>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleActive}
          title={link.is_active ? '隐藏链接' : '显示链接'}
        >
          {link.is_active ? (
            <FaEye className="h-4 w-4" />
          ) : (
            <FaEyeSlash className="h-4 w-4" />
          )}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onEdit}
          title="编辑链接"
        >
          <FaEdit className="h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          title="删除链接"
          className="text-red-600 hover:text-red-700"
        >
          <FaTrash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}