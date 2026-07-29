/**
 * Utility functions for M$AVietnam
 */

import { type ClassValue, clsx } from 'clsx';

// Simple class merge (no twMerge dependency needed initially)
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format Vietnamese currency
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

// Format date to Vietnamese locale
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return formatDate(date);
}

// Generate slug from Vietnamese text
export function generateSlug(text: string): string {
  const from = 'àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ';
  const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';

  let slug = text.toLowerCase();
  for (let i = 0; i < from.length; i++) {
    slug = slug.replace(new RegExp(from[i], 'g'), to[i]);
  }

  return slug
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

// Get deal type label in Vietnamese
export function getDealTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    buyout: 'Chuyển Nhượng 100%',
    joint_venture: 'Hợp Tác Đầu Tư',
  };
  return labels[type] || type;
}

// Get project type label in Vietnamese
export function getProjectTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    residential: 'Khu dân cư',
    resort: 'Nghỉ dưỡng',
    commercial: 'Thương mại - Dịch vụ',
    urban_low_rise: 'Đô thị thấp tầng',
    industrial: 'Khu công nghiệp',
    other: 'Khác',
  };
  return labels[type] || type;
}

// Get lead status label in Vietnamese
export function getLeadStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: 'Lead mới',
    contacted: 'Đã liên hệ',
    nda_sent: 'Đang gửi NDA',
    due_diligence: 'Đang thẩm định',
    closed_won: 'Đóng deal',
    closed_lost: 'Không thành công',
    draft_pending: 'Draft chờ thẩm định',
    in_progress: 'Đang làm việc',
    published: 'Đã lên bài',
    rejected: 'Từ chối',
  };
  return labels[status] || status;
}

// Validate email format
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate Vietnamese phone number
export function isValidPhone(phone: string): boolean {
  return /^(0|\+84)[0-9]{9,10}$/.test(phone.replace(/\s/g, ''));
}
