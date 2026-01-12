# Changelog

Bu dosya projedeki tüm önemli değişiklikleri belgeler.

Format [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) standardına,
versiyonlama [Semantic Versioning](https://semver.org/spec/v2.0.0.html) standardına uygundur.

## [Unreleased]

### Added
- İyileştirmeler Güncel sayfası (stakeholder perspektifleri ile)
- Dokümantasyon: WIDGET_GUIDE.md, CONTRIBUTING.md
- Architecture Decision Records (ADR) klasörü
- 6 yeni widget (HeatmapCalendar, FunnelChart, AvatarGroup, CurrencyExchange, ServerMonitor, PollWidget)

### Changed
- Varsayılan tema ocean-blue'dan default-light'a değiştirildi
- Mobile responsive iyileştirmeleri

### Fixed
- Mobile sidebar overlay düzeltmesi
- Hamburger menü navigasyon kapanma sorunu

---

## [0.2.0] - 2026-01-12

### Added
- **Phase 6: Advanced Features**
  - Multi-page dashboard desteği
  - Widget kopyala/yapıştır
  - Dashboard paylaşım linki
  - Widget auto-refresh interval
  - PDF export (html2canvas)
  
- **Supabase Entegrasyonu**
  - SupabaseAdapter storage adapter
  - Tenants ve Layouts tabloları
  - RLS politikaları
  
- **Yeni Widget'lar**
  - Timeline Widget
  - Gauge Widget
  - Tag Cloud
  - Code Snippet
  
- **Deployment**
  - Vercel config (vercel.json)
  - Netlify config (netlify.toml)
  - Environment variables setup

### Changed
- ConfigService otomatik adapter seçimi (Supabase > LocalStorage)
- Widget registry kategorileri güncellendi

---

## [0.1.0] - 2026-01-01

### Added
- **Core Features**
  - Multi-tenant mimari
  - URL-based tenant resolution
  - Zustand state management
  - Theme customization (light/dark, colors, radius)
  
- **Widget System**
  - Widget registry pattern
  - 35+ widget (StatCard, MiniChart, SimpleTable, vb.)
  - Drag-drop widget düzenleme
  - Widget props editor
  
- **Admin Panel**
  - Tema ayarları
  - Dil ayarları (i18next)
  - Sidebar konfigürasyonu
  - Drag-drop ayarları
  
- **UX Features**
  - Global arama (Cmd+K)
  - Onboarding wizard
  - Toast notifications
  - Keyboard shortcuts
  - Empty states
  
- **Backend Ready**
  - Storage adapter pattern
  - LocalStorageAdapter
  - Zod validation
  - Config versioning
  - Audit log

### Technical
- React 19, Vite 7, Tailwind CSS 4
- Zustand for state management
- dnd-kit for drag-drop
- i18next for internationalization
- Radix UI primitives

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| 0.2.0 | 2026-01-12 | Advanced features, Supabase, Deployment |
| 0.1.0 | 2026-01-01 | Initial release, core features |

## Links

- [GitHub Repository](https://github.com/brkdnz/multitenant-dashboard)
- [Documentation](./README.md)
- [Contributing](./CONTRIBUTING.md)
