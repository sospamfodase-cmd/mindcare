import { LucideIcon } from 'lucide-react';

export interface LinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon: LucideIcon;
  primary?: boolean;
}

export interface NewsletterState {
  email: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export interface InsightState {
  text: string;
  loading: boolean;
  error: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Full content
  date: string;
  category: string;
  image: string; // Cover image (main)
  images?: string[]; // Additional images
  pdf?: string; // Attached PDF (base64 or URL)
  author: string;
}

export interface User {
  username: string;
  isAdmin: boolean;
}