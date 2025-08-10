-- 创建用户资料表
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- 创建链接表
CREATE TABLE links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建分析事件表
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_type VARCHAR(50) NOT NULL, -- 'page_view', 'link_click'
  link_id UUID REFERENCES links(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_links_user_id ON links(user_id);
CREATE INDEX idx_links_position ON links(position);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_link_id ON analytics_events(link_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略
-- profiles 表策略
CREATE POLICY "用户只能查看自己的资料" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "用户只能更新自己的资料" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "用户可以插入自己的资料" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "允许查看所有用户的公开资料（通过用户名）" ON profiles
  FOR SELECT USING (true);

-- links 表策略
CREATE POLICY "用户只能查看自己的链接" ON links
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户只能更新自己的链接" ON links
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "用户只能插入自己的链接" ON links
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户只能删除自己的链接" ON links
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "允许查看活跃链接（公开访问）" ON links
  FOR SELECT USING (is_active = true);

-- analytics_events 表策略
CREATE POLICY "用户只能查看自己的分析数据" ON analytics_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "任何人都可以插入分析事件" ON analytics_events
  FOR INSERT WITH CHECK (true);

-- 创建触发器函数来更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表创建触发器
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_links_updated_at
  BEFORE UPDATE ON links
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- 创建函数来获取用户的公开资料（通过用户名）
CREATE OR REPLACE FUNCTION get_public_profile(username_param TEXT)
RETURNS TABLE (
  id UUID,
  username VARCHAR(50),
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.username, p.display_name, p.bio, p.avatar_url
  FROM profiles p
  WHERE p.username = username_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数来获取用户的活跃链接（通过用户名）
CREATE OR REPLACE FUNCTION get_user_links(username_param TEXT)
RETURNS TABLE (
  id UUID,
  title VARCHAR(100),
  url TEXT,
  description TEXT,
  icon VARCHAR(50),
  position INTEGER,
  click_count INTEGER
) AS $
BEGIN
  RETURN QUERY
  SELECT l.id, l.title, l.url, l.description, l.icon, l.position, l.click_count
  FROM links l
  JOIN profiles p ON l.user_id = p.id
  WHERE p.username = username_param AND l.is_active = true
  ORDER BY l.position ASC;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建函数来增加链接点击数
CREATE OR REPLACE FUNCTION increment_click_count(link_id_param UUID)
RETURNS VOID AS $
BEGIN
  UPDATE links 
  SET click_count = click_count + 1 
  WHERE id = link_id_param;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;