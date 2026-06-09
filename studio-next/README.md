# Vistaar Studio (Next.js 15 Foundation)

This is a production-grade frontend foundation for the premium AI banner studio.

## Included now
- Next.js 15 + TypeScript + Tailwind setup
- Landing page with premium sections (hero, templates, workflow, testimonials, pricing, FAQ)
- Dashboard skeleton (projects, assets, AI history, billing placeholders)
- Canva-like editor shell:
  - Top toolbar
  - Asset sidebar
  - Layers panel
  - Properties panel
  - Timeline rail placeholder
  - Fabric.js canvas
  - Zoom controls
  - Keyboard delete + undo shortcut hook
  - Autosave to localStorage
  - AI generation mock action
  - Banner preset switching

## Run
```bash
cd studio-next
npm install
npm run dev
```

## Planned next increments
1. Real OpenAI integration (prompt-to-design, style remix, copy generation)
2. Real-time collaboration (presence, comments, shared cursors via websockets)
3. Cloud save/export pipeline (PostgreSQL/Prisma + Cloudinary)
4. Animation timeline and GIF/MP4 export pipeline
5. Team workspaces, permissions, billing

