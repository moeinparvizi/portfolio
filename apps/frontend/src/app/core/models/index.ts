export interface LocaleText {
  fa?: string;
  en?: string;
  de?: string;
}

export interface Profile {
  id: string;
  fullName: LocaleText;
  jobTitle: LocaleText;
  summary: LocaleText;
  avatarUrl?: string;
  logoUrl?: string;
  heroText: LocaleText;
  heroCtaLabel: LocaleText;
  heroCtaLink?: string;
  socialLinks: Record<string, string>;
}

export interface Skill {
  id: string;
  name: LocaleText;
  category?: string;
  level?: number;
  icon?: string;
  sortOrder: number;
}

export interface Project {
  id: string;
  title: LocaleText;
  description: LocaleText;
  summary: LocaleText;
  images: string[];
  tags: string[];
  category?: string;
  liveUrl?: string;
  githubUrl?: string;
  status: 'draft' | 'published';
  includeInResume: boolean;
  sortOrder: number;
  featured: boolean;
}

export interface Experience {
  id: string;
  company: LocaleText;
  position: LocaleText;
  description: LocaleText;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  location?: string;
  includeInResume: boolean;
  sortOrder: number;
}

export interface Education {
  id: string;
  institution: LocaleText;
  degree: LocaleText;
  fieldOfStudy: LocaleText;
  description: LocaleText;
  startDate: string;
  endDate?: string;
  includeInResume: boolean;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: LocaleText;
  company?: string;
  content: LocaleText;
  avatarUrl?: string;
  rating?: number;
  approved: boolean;
  visible: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  replied: boolean;
  createdAt: string;
}

export interface SiteSettings {
  key: string;
  value: any;
}

export type Locale = 'fa' | 'en' | 'de';
