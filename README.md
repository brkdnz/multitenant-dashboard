# Multi-Tenant Dashboard Builder

Vite + React (JavaScript) ile geliştirilmiş, multi-tenant destekli, tamamen özelleştirilebilir bir dashboard builder altyapısı.

## 🚀 Özellikler

### Temel Özellikler
- **Multi-Tenant Mimari**: Her tenant için ayrı tema, dil, sidebar ve layout ayarları
- **Draggable Widgets**: dnd-kit ile sürükle-bırak widget yönetimi
- **Tema Yönetimi**: Renk paleti, dark/light mod, border radius ayarları
- **Çoklu Dil**: i18next ile TR/EN desteği ve tenant bazlı çeviri override
- **Sidebar Modları**: icon-only, icon+text, collapsed seçenekleri
- **Admin Panel**: Tüm özelleştirmeler için merkezi yönetim paneli
- **Storage Adapter**: LocalStorage ile başlangıç, backend'e hazır interface

### ⭐ High Priority Özellikler (Implement Edildi)

| Özellik | Açıklama | Dosya |
|---------|----------|-------|
| **Role-Based Widget Visibility** | Kullanıcı rollerine göre widget görünürlüğü kontrolü | `src/lib/rbac.js` |
| **Configuration Versioning** | Tenant config değişiklik geçmişi ve rollback | `src/lib/versioning.js` |
| **Audit Log** | Tüm yapılandırma değişikliklerinin kaydı | `src/lib/auditLog.js` |
| **Undo/Redo** | Ctrl+Z / Ctrl+Y ile değişiklikleri geri alma | `src/lib/history.js` |
| **Autosave** | Otomatik kaydetme (3 saniye gecikme ile) | `src/hooks/useAutosave.js` |
| **Visual Widget Props Editor** | Widget özelliklerini görsel düzenleme | `src/components/admin/WidgetPropsEditor.jsx` |

## 📦 Kurulum

```bash
# Projeyi klonla
cd multitenant-dashboard

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

## 🏗️ Proje Yapısı

```
src/
├── app/                    # Store ve providers
│   └── store.js           # Zustand store (tenant, theme, ui, drag slices)
│
├── tenancy/               # Tenant yönetimi
│   ├── TenantContext.jsx  # Tenant context provider
│   ├── TenantResolver.jsx # URL'den tenant çözümleme
│   └── ConfigService.js   # Tenant config CRUD
│
├── config/                # Konfigürasyon
│   ├── schema.js          # Zod validasyon şemaları
│   ├── defaults.js        # Varsayılan değerler
│   ├── tenants/           # Mock tenant configs
│   └── adapters/          # Storage adapters
│
├── widgets/               # Widget sistemi
│   ├── registry.js        # Widget kaydı
│   ├── WidgetShell.jsx    # Drag handle wrapper
│   ├── WidgetRenderer.jsx # Dinamik widget render
│   └── components/        # Widget bileşenleri
│
├── pages/                 # Sayfalar
│   ├── Home.jsx          # Ana dashboard
│   ├── WidgetsGallery.jsx # Widget galerisi
│   ├── AdminPanel.jsx    # Yönetim paneli (5 tab)
│   └── Suggestions.jsx   # Özellik önerileri
│
├── components/            # UI bileşenleri
│   ├── layout/           # MainLayout, Sidebar, Header
│   ├── admin/            # ThemeEditor, LanguageEditor, SidebarSettings,
│   │                     # DragSettings, VersionHistory, WidgetPropsEditor
│   ├── dnd/              # Drag-drop bileşenleri
│   └── ui/               # shadcn/ui bileşenleri
│
├── hooks/                 # Custom hooks
│   └── useAutosave.js    # Autosave hook
│
├── i18n/                  # Internationalization
│   ├── index.js          # i18next setup
│   └── resources/        # TR/EN çevirileri
│
└── lib/                   # Yardımcı fonksiyonlar
    ├── utils.js          # Utility fonksiyonlar
    ├── rbac.js           # Role-Based Access Control
    ├── auditLog.js       # Audit log service
    ├── versioning.js     # Configuration versioning
    └── history.js        # Undo/Redo history store
```

## 🎨 Teknoloji Kararları

### State Management: Zustand
Redux Toolkit yerine **Zustand** tercih edildi:
- %70 daha az boilerplate kod
- Built-in persist middleware ile localStorage entegrasyonu
- TypeScript olmadan da mükemmel developer experience
- Modüler slice yapısı ile temiz kod organizasyonu

### Drag & Drop: dnd-kit
react-grid-layout yerine **dnd-kit** tercih edildi:
- Modern hooks-first API tasarımı
- Built-in accessibility (ARIA + keyboard) desteği
- Lightweight (~12KB gzipped)
- Esnek collision detection algoritmaları
- Touch, mouse ve keyboard sensor desteği

### Storage: Adapter Pattern
Backend'e kolay geçiş için Adapter Pattern:
- `LocalStorageAdapter`: Geliştirme/demo için
- `ApiStorageAdapter`: Production için hazır interface
- `ConfigService`: Tüm CRUD işlemlerini adapter üzerinden yapar

### Validation: Zod
Runtime configuration validation için **Zod**:
- TypeScript olmadan da tip güvenliği sağlar
- Anlaşılır hata mesajları
- Default değer desteği
- Nested object validation

## ⭐ High Priority Özellik Detayları

### 1. Role-Based Widget Visibility (RBAC)
Kullanıcı rollerine göre widget görünürlüğünü kontrol eder.

```javascript
import { Roles, canViewWidget, filterWidgetsByRole } from '@/lib/rbac'

// Roller: ADMIN, MANAGER, USER, GUEST
// Widget'a permission ekle:
registerWidget({
  id: 'admin-only-widget',
  permissions: [Roles.ADMIN], // Sadece adminler görebilir
})

// Kullanım:
const visibleWidgets = filterWidgetsByRole(widgets, getWidget, userRole)
```

### 2. Configuration Versioning
Tenant konfigürasyonlarının versiyon geçmişini tutar.

```javascript
import { saveConfigVersion, getConfigVersions, rollbackToVersion } from '@/lib/versioning'

// Versiyon kaydet
saveConfigVersion(tenantId, config, 'Manual save')

// Tüm versiyonları al
const versions = getConfigVersions(tenantId)

// Önceki versiyona dön
const oldConfig = rollbackToVersion(tenantId, versionId)
```

### 3. Audit Log
Tüm yapılandırma değişikliklerini timestamp ile kaydeder.

```javascript
import { logAction, getAuditLog, AuditActions } from '@/lib/auditLog'

// İşlem kaydet
logAction(AuditActions.THEME_MODE_CHANGE, { mode: 'dark' }, tenantId)

// Log'ları al
const logs = getAuditLog()
```

### 4. Undo/Redo
Klavye kısayolları ile değişiklikleri geri alma:
- **Ctrl+Z**: Undo
- **Ctrl+Y** veya **Ctrl+Shift+Z**: Redo

```javascript
import { useHistoryStore } from '@/lib/history'

const { undo, redo, canUndo, canRedo } = useHistoryStore()
```

### 5. Autosave
Değişiklikler otomatik olarak kaydedilir (varsayılan: 3 saniye gecikme).

```javascript
import { useAutosave } from '@/hooks/useAutosave'

// Kullanım:
useAutosave(config, 3000, true) // 3 saniye delay, enabled
```

### 6. Widget Props Editor
Widget özelliklerini görsel olarak düzenleme imkanı sunar.

```jsx
import WidgetPropsEditor from '@/components/admin/WidgetPropsEditor'

<WidgetPropsEditor
  widget={widgetInstance}
  widgetDef={widgetDefinition}
  onSave={(newProps) => updateWidget(newProps)}
  onClose={() => setEditing(false)}
/>
```

## 🔧 Yeni Widget Ekleme

### 1. Widget Bileşenini Oluştur

`src/widgets/components/` altında yeni bir dosya oluşturun:

```jsx
// src/widgets/components/MyWidget.jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function MyWidget({ title, customProp }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Custom content: {customProp}</p>
      </CardContent>
    </Card>
  )
}
```

### 2. Widget'ı Registry'ye Kaydet

`src/widgets/registry.js` dosyasını düzenleyin:

```jsx
import MyWidget from './components/MyWidget'
import { Roles } from '@/lib/rbac'

registerWidget({
  id: 'my-widget',
  title: 'widgets.myWidget.title',
  description: 'widgets.myWidget.description',
  icon: 'box',
  component: MyWidget,
  category: 'custom',
  defaultProps: {
    title: 'My Widget',
    customProp: 'Default value',
  },
  permissions: [Roles.USER], // Opsiyonel: sadece USER ve üstü görebilir
})
```

### 3. Çevirileri Ekle

`src/i18n/resources/en.json` ve `tr.json` dosyalarına:

```json
{
  "widgets": {
    "myWidget": {
      "title": "My Widget",
      "description": "Description of my widget"
    }
  }
}
```

## 🎯 Mock Tenant Configs

### Tenant A (Türkçe)
- Dil: Türkçe
- Sidebar: icon+text modu
- Drag: Aktif
- Tema: Light, mavi renk paleti

### Tenant B (English)
- Dil: İngilizce
- Sidebar: icon-only modu
- Drag: Kapalı
- Tema: Dark, mor renk paleti

## 📋 Kabul Kriterleri Kontrolü

### Temel Özellikler
- ✅ Tenant değişince tema/dil/sidebar/logo/layout değişiyor
- ✅ Admin panelde değişiklikler anında preview oluyor
- ✅ Kaydet butonu ile persist ediliyor
- ✅ Global drag kapatınca hiçbir yerde sürükleme çalışmıyor
- ✅ Sayfa bazlı kapatma sadece o sayfayı etkiliyor
- ✅ Widget bazlı kapatma sadece o widget'ı etkiliyor
- ✅ i18n kapatılınca dil seçici gizleniyor
- ✅ Sidebar mode değişince UI güncelleniyor
- ✅ Responsive tasarım
- ✅ Dark/light mode toggle

### High Priority Özellikler
- ✅ Role-Based Widget Visibility implement edildi
- ✅ Configuration Versioning implement edildi
- ✅ Audit Log implement edildi
- ✅ Undo/Redo (Ctrl+Z/Y) implement edildi
- ✅ Autosave implement edildi
- ✅ Widget Props Editor implement edildi

## 🛠️ Scripts

```bash
npm run dev      # Geliştirme sunucusu
npm run build    # Production build
npm run preview  # Build preview
npm run lint     # ESLint kontrolü
```

## 📁 Önemli Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `src/app/store.js` | Zustand store tanımları |
| `src/tenancy/ConfigService.js` | Tenant config CRUD |
| `src/widgets/registry.js` | Widget kaydı |
| `src/lib/rbac.js` | Role-Based Access Control |
| `src/lib/versioning.js` | Config versiyonlama |
| `src/lib/auditLog.js` | Audit log servisi |
| `src/lib/history.js` | Undo/Redo history |
| `src/hooks/useAutosave.js` | Autosave hook |

## 🔒 Güvenlik Notları

- Tenant config'ler localStorage'da saklanır (production için API kullanılmalı)
- RBAC sistemi implement edildi, widget bazlı permission desteği hazır
- CORS ve authentication backend entegrasyonunda ele alınmalı

## 📝 Lisans

MIT
