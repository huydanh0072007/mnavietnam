export type DealType = 'buyout' | 'joint_venture';
export type ProjectType = 'residential' | 'resort' | 'commercial' | 'urban_low_rise' | 'industrial' | 'other';
export type PublishStatus = 'draft' | 'published' | 'hidden';
export type LeadType = 'interest' | 'submission';
export type InvestorLeadStatus = 'new' | 'contacted' | 'nda_sent' | 'due_diligence' | 'closed_won' | 'closed_lost';
export type SubmissionLeadStatus = 'draft_pending' | 'in_progress' | 'published' | 'rejected';

export interface Project {
  id: string;
  project_code: string;
  title: string;
  slug: string;
  deal_type: DealType;
  status_label: string;
  project_type: ProjectType;
  province: string;
  district: string;
  scale: string;
  legal_status_summary: string;
  current_status: string;
  valuation_display: string;
  show_valuation: boolean;
  capital_structure_summary: string;
  highlights: string[];
  description: string;
  gallery_images: string[];
  teaser_pdf: string;
  is_featured: boolean;
  featured_order: number;
  publish_status: PublishStatus;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  lead_type: LeadType;
  full_name: string;
  organization: string;
  email: string;
  phone: string;
  role_title?: string;
  message?: string;
  project_name_location?: string;
  preferred_deal_type?: DealType;
  estimated_scale?: string;
  attachment_url?: string;
  related_project_id?: string;
  related_project?: Project;
  status: InvestorLeadStatus | SubmissionLeadStatus;
  assigned_admin_id?: string;
  internal_notes: Array<{text: string; author: string; timestamp: string}>;
  audit_logs?: Array<{action: string; file_url?: string; timestamp: string}>;
  signature_url?: string;
  created_at: string;
}

export interface NDASignature {
  id: string;
  project_id: string;
  full_name: string;
  organization: string;
  email: string;
  cccd_hashed: string;
  ip_address: string;
  user_agent: string;
  signature_base64: string;
  agreed_to_pdpd: boolean;
  signed_at: string;
}
