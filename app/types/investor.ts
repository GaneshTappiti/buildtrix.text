// Investor Radar Types
export type InvestorStatus = 'to-contact' | 'contacted' | 'meeting-scheduled' | 'in-discussion' | 'passed' | 'invested';

export interface Investor {
  id: string;
  name: string;
  company: string;
  position: string;
  email: string;
  linkedinUrl?: string;
  website?: string;
  location?: string;
  focusAreas: string[];
  investmentRange?: string;
  portfolioSize?: number;
  rating?: number;
  description?: string;
  status: InvestorStatus;
  lastMeeting?: string;
  notes?: string;
  avatar?: string;
  recentInvestments?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  user_id?: string;
}

export interface InvestorInput {
  name: string;
  company: string;
  position: string;
  email: string;
  linkedinUrl?: string;
  website?: string;
  location?: string;
  focusAreas: string[];
  investmentRange?: string;
  portfolioSize?: number;
  description?: string;
  status: InvestorStatus;
  lastMeeting?: string;
  notes?: string;
}

export interface FundingRound {
  id: string;
  name: string;
  target: string;
  raised: string;
  progress: number;
  investors: number;
  status: 'active' | 'planned' | 'completed';
  timeline?: string;
  description?: string;
  createdAt?: Date;
  user_id?: string;
}

export interface FundingRoundInput {
  name: string;
  target: string;
  raised: string;
  progress: number;
  investors: number;
  status: 'active' | 'planned' | 'completed';
  timeline?: string;
  description?: string;
}

export interface ContactLog {
  id: string;
  investorId: string;
  date: string;
  type: 'email' | 'call' | 'meeting' | 'linkedin' | 'other';
  notes: string;
  outcome?: string;
  createdAt: Date;
}

export interface InvestorFilters {
  status?: InvestorStatus[];
  focusAreas?: string[];
  location?: string[];
  investmentRange?: string[];
  rating?: number;
}

export interface SortOption {
  field: keyof Investor;
  direction: 'asc' | 'desc';
  label: string;
}
