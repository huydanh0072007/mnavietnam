export type DealType = 'buyout' | 'partial_transfer' | 'share_transfer' | 'joint_venture' | 'lease';
export type ProjectType = 'residential' | 'resort' | 'commercial' | 'industrial' | 'logistics' | 'hospitality' | 'healthcare' | 'education' | 'energy' | 'agriculture' | 'other';
export type PublishStatus = 'draft' | 'published' | 'hidden';
export type LeadType = 'interest' | 'submission';
export type InvestorLeadStatus = 'new' | 'contacted' | 'nda_sent' | 'due_diligence' | 'closed_won' | 'closed_lost';
export type SubmissionLeadStatus = 'draft_pending' | 'in_progress' | 'published' | 'rejected';

export interface Project {
  id: string;
  project_code: string;
  title: string;
  title_en?: string;
  slug: string;
  deal_type: DealType;
  status_label: string;
  status_label_en?: string;
  project_type: ProjectType;
  province: string;
  district?: string;
  scale: string;
  scale_en?: string;
  legal_status_summary: string;
  legal_status_summary_en?: string;
  current_status: string;
  current_status_en?: string;
  valuation_display: string;
  valuation_display_en?: string;
  show_valuation: boolean;
  capital_structure_summary: string;
  capital_structure_summary_en?: string;
  highlights: string[];
  highlights_en?: string[];
  description: string;
  description_en?: string;
  gallery_images: string[];
  teaser_pdf: string;
  is_featured: boolean;
  featured_order: number;
  publish_status: PublishStatus;
  is_active?: boolean;
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
  is_active?: boolean;
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
