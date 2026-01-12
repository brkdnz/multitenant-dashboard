# ADR-004: Widget Sistemi Tasarımı

**Tarih**: 2026-01-01  
**Durum**: Kabul Edildi

## Bağlam

Dashboard üzerinde kullanıcıların ekleyip düzenleyebileceği, farklı veri görselleştirmeleri sunan widget'lar gerekiyor. Bu widget'lar:
- Kolayca eklenebilmeli
- Konfigüre edilebilmeli
- Sürükle-bırak ile düzenlenebilmeli
- Lazy load olmalı

## Karar

**Registry pattern** ile **lazy-loaded widget components** yaklaşımı kullanılmasına karar verildi.

## Tasarım

### Widget Registry

```javascript
// registry.js
const widgets = new Map()

export function registerWidget(widget) {
    if (!widget.id) throw new Error('Widget must have an id')
    widgets.set(widget.id, widget)
}

export function getWidget(id) {
    return widgets.get(id) || null
}

export function getAllWidgets() {
    return Array.from(widgets.values())
}
```

### Widget Kayıt Formatı

```javascript
registerWidget({
    id: 'stat-card',           // Benzersiz ID
    title: 'Stat Card',        // Görünen isim
    description: 'Single metric', // Açıklama
    icon: 'activity',          // lucide-react icon
    component: StatCard,       // React component (lazy)
    category: 'statistics',    // Kategori
    defaultProps: { title: 'Metric', value: 0 },
    permissions: [],           // RBAC
})
```

### Widget Instance (Layout'ta)

```javascript
{
    instanceId: 'widget-123',  // Unique per layout
    widgetId: 'stat-card',     // Registry reference
    props: { title: 'Revenue', value: 45000 },
    position: { x: 0, y: 0, w: 1, h: 1 }
}
```

### Widget Renderer

```javascript
function WidgetRenderer({ instance }) {
    const widgetDef = getWidget(instance.widgetId)
    const Component = widgetDef.component
    
    return (
        <Suspense fallback={<WidgetSkeleton />}>
            <Component {...widgetDef.defaultProps} {...instance.props} />
        </Suspense>
    )
}
```

## Kategoriler

| Kategori | Amaç |
|----------|------|
| `statistics` | KPI, metrik kartları |
| `data` | Tablo, liste gösterimleri |
| `charts` | Grafik görselleştirmeleri |
| `utilities` | Saat, takvim, araçlar |
| `media` | Resim, video içerik |
| `social` | Sosyal, finans widget'ları |

## Sonuçlar

### Olumlu
- Yeni widget eklemek 2 adım (component + register)
- Lazy loading ile performans
- Merkezi registry ile yönetim
- Props validation mümkün

### Olumsuz
- Widget'lar arası iletişim yok
- Real-time data refresh manuel
- Karmaşık widget'larda state yönetimi zor

## Mevcut Widget Sayısı

- **41+ widget** 6 kategoride
- Bkz: `WIDGET_GUIDE.md`
