import { BannerPreset, TemplateCard } from '@/types';

export const bannerPresets: BannerPreset[] = [
  { id: 'youtube', name: 'YouTube Banner', size: { width: 2560, height: 1440 }, category: 'Social' },
  { id: 'insta-post', name: 'Instagram Post', size: { width: 1080, height: 1080 }, category: 'Social' },
  { id: 'insta-story', name: 'Instagram Story', size: { width: 1080, height: 1920 }, category: 'Social' },
  { id: 'linkedin', name: 'LinkedIn Banner', size: { width: 1584, height: 396 }, category: 'Business' },
  { id: 'x-header', name: 'X Header', size: { width: 1500, height: 500 }, category: 'Social' },
  { id: 'hero', name: 'Website Hero', size: { width: 1920, height: 1080 }, category: 'Web' },
  { id: 'google-ad', name: 'Google Ads', size: { width: 1200, height: 628 }, category: 'Ads' }
];

export const templateCards: TemplateCard[] = [
  { id: 't1', title: 'SaaS Product Launch', category: 'SaaS', gradient: 'from-cyan-500 to-blue-700' },
  { id: 't2', title: 'Festival Sale Burst', category: 'Ecommerce', gradient: 'from-fuchsia-500 to-orange-500' },
  { id: 't3', title: 'Founder Story Hero', category: 'Startup', gradient: 'from-indigo-500 to-violet-700' },
  { id: 't4', title: 'Meme Drop Banner', category: 'Meme', gradient: 'from-lime-500 to-emerald-700' }
];

export const fakeTestimonials = [
  { name: 'Aarav, Growth Lead', text: 'We cut creative turnaround from 3 days to 30 minutes.' },
  { name: 'Mira, Founder', text: 'Feels faster than native desktop tools. Shockingly smooth.' },
  { name: 'Rohan, Performance Marketer', text: 'AI variation flow is insanely useful for ad testing.' }
];

