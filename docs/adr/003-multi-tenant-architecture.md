# ADR-003: Multi-Tenant Mimari Tasarımı

**Tarih**: 2026-01-01  
**Durum**: Kabul Edildi

## Bağlam

Uygulama birden fazla organizasyonu (tenant) desteklemeli. Her tenant'ın kendi tema, layout, dil ve widget konfigürasyonu olmalı.

## Karar

**URL-based tenant resolution** ile **shared database, shared schema** multi-tenant mimarisi kullanılmasına karar verildi.

## Multi-Tenant Stratejileri

### 1. Separate Database per Tenant
- ✅ Tam izolasyon
- ✅ Performans garantisi
- ❌ Yönetimi zor
- ❌ Maliyet yüksek

### 2. Shared Database, Separate Schema
- ✅ İyi izolasyon
- ✅ Orta maliyet
- ❌ Migration karmaşıklığı
- ❌ Cross-tenant query zor

### 3. Shared Database, Shared Schema (Seçilen)
- ✅ Basit yönetim
- ✅ Düşük maliyet
- ✅ Kolay migration
- ⚠️ RLS ile güvenlik sağlanmalı
- ⚠️ Noisy neighbor riski

## Tenant Resolution

URL formatı: `/t/{tenantId}/...`

```javascript
// TenantResolver.jsx
function TenantResolver({ children }) {
    const { tenantId } = useParams()
    
    useEffect(() => {
        configService.getTenantConfig(tenantId)
            .then(config => setTenant(config))
    }, [tenantId])
    
    return <TenantContext.Provider value={tenant}>
        {children}
    </TenantContext.Provider>
}
```

## Tenant Config Yapısı

```javascript
{
    id: 'tenant-a',
    name: 'Tenant A',
    theme: { mode: 'light', colors: {...}, radius: 'lg' },
    branding: { logoUrl: '...', appName: '...' },
    sidebar: { mode: 'icon-text', position: 'left' },
    i18n: { enabled: true, defaultLanguage: 'tr' },
    layouts: { home: [...widgets], analytics: [...] },
    drag: { globalEnabled: true, pageOverrides: {} },
    featureFlags: { widgetDrag: true, i18n: true }
}
```

## Sonuçlar

### Olumlu
- Hızlı geliştirme
- Kolay onboarding (URL paylaşımı)
- Tek codebase bakımı

### Olumsuz
- Tenant izolasyonu RLS'e bağımlı
- Büyük tenant'lar performansı etkileyebilir
- Tenant-specific customization sınırlı

## Gelecek İyileştirmeler

1. Tenant-based rate limiting
2. Custom domain support
3. Tenant quota management
4. Cross-tenant analytics (aggregated)
