import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, event_type, link_id, referrer, user_agent } = body

    const supabase = await createClient()

    // 获取客户端 IP
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(/, /)[0] : request.headers.get('x-real-ip')

    // 插入分析事件
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        user_id,
        event_type,
        link_id: link_id || null,
        ip_address: ip || null,
        user_agent: user_agent || null,
        referrer: referrer || null
      })

    if (error) {
      console.error('Analytics tracking error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 如果是链接点击，更新链接点击数
    if (event_type === 'link_click' && link_id) {
      await supabase.rpc('increment_click_count', { link_id_param: link_id })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}