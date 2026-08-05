import { getSupabaseServerClient, isSupabaseConfigured } from './supabase/server';

export interface NotificationItem {
  id: string;
  title: string;
  content?: string;
  type: string; // 'new_lead' | 'vdr_sign' | 'project_update'
  link?: string;
  is_read: boolean;
  created_at: string;
}

// In-memory fallback for local development or when Supabase is not configured
let mockNotifications: NotificationItem[] = [
  {
    id: 'mock-1',
    title: 'Hệ thống đã sẵn sàng',
    content: 'Chào mừng bạn quay lại CMS Admin Panel của M$A International.',
    type: 'project_update',
    link: '/admin',
    is_read: false,
    created_at: new Date().toISOString()
  }
];

export async function getNotifications(): Promise<NotificationItem[]> {
  if (!isSupabaseConfigured()) {
    return mockNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications from Supabase:', error);
      return [];
    }

    return data as NotificationItem[];
  } catch (err) {
    console.error('Exception fetching notifications:', err);
    return [];
  }
}

export async function addNotification(
  title: string,
  content?: string,
  type: string = 'new_lead',
  link?: string
): Promise<NotificationItem | null> {
  const newNotif = {
    title,
    content: content || '',
    type,
    link: link || '',
    is_read: false,
    created_at: new Date().toISOString()
  };

  if (!isSupabaseConfigured()) {
    const saved: NotificationItem = {
      ...newNotif,
      id: `N-${Date.now()}`
    };
    mockNotifications.push(saved);
    return saved;
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('admin_notifications')
      .insert([newNotif])
      .select()
      .single();

    if (error) {
      console.error('Error adding notification to Supabase:', error);
      return null;
    }

    return data as NotificationItem;
  } catch (err) {
    console.error('Exception adding notification:', err);
    return null;
  }
}

export async function markAsRead(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const notif = mockNotifications.find(n => n.id === id);
    if (notif) {
      notif.is_read = true;
      return true;
    }
    return false;
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from('admin_notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read in Supabase:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception marking notification as read:', err);
    return false;
  }
}

export async function markAllAsRead(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    mockNotifications.forEach(n => {
      n.is_read = true;
    });
    return true;
  }

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase
      .from('admin_notifications')
      .update({ is_read: true })
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read in Supabase:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception marking all notifications as read:', err);
    return false;
  }
}
