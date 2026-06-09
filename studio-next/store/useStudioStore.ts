'use client';

import { create } from 'zustand';

type Project = { id: string; name: string; updatedAt: string };

type StudioState = {
  projects: Project[];
  activeProjectId: string | null;
  history: string[];
  aiHistory: string[];
  setActiveProject: (id: string) => void;
  pushHistory: (entry: string) => void;
  pushAiHistory: (entry: string) => void;
};

export const useStudioStore = create<StudioState>((set) => ({
  projects: [
    { id: 'p1', name: 'Summer Launch Campaign', updatedAt: 'Just now' },
    { id: 'p2', name: 'Creator Marketplace Banner', updatedAt: '2h ago' }
  ],
  activeProjectId: 'p1',
  history: [],
  aiHistory: [],
  setActiveProject: (id) => set({ activeProjectId: id }),
  pushHistory: (entry) => set((s) => ({ history: [entry, ...s.history].slice(0, 30) })),
  pushAiHistory: (entry) => set((s) => ({ aiHistory: [entry, ...s.aiHistory].slice(0, 30) }))
}));

