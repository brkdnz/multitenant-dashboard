# Widget Oluşturma Rehberi

Bu rehber, Multi-Tenant Dashboard Builder için yeni widget oluşturma sürecini adım adım açıklar.

## 📋 İçindekiler

1. [Widget Anatomisi](#widget-anatomisi)
2. [Yeni Widget Oluşturma](#yeni-widget-oluşturma)
3. [Registry'ye Kayıt](#registryye-kayıt)
4. [Props ve Validasyon](#props-ve-validasyon)
5. [Tema Entegrasyonu](#tema-entegrasyonu)
6. [İyi Pratikler](#iyi-pratikler)

---

## Widget Anatomisi

Her widget şu bileşenlerden oluşur:

```
src/widgets/
├── components/
│   └── MyWidget.jsx     # Widget UI bileşeni
└── registry.js          # Widget kayıt sistemi
```

### Temel Widget Yapısı

```jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function MyWidget({ title, ...props }) {
    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Widget içeriği */}
            </CardContent>
        </Card>
    )
}
```

---

## Yeni Widget Oluşturma

### Adım 1: Dosya Oluşturma

`src/widgets/components/` altında yeni bir dosya oluşturun:

```bash
# Örnek: CounterWidget.jsx
touch src/widgets/components/CounterWidget.jsx
```

### Adım 2: Widget Kodunu Yazma

```jsx
// src/widgets/components/CounterWidget.jsx
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Minus } from 'lucide-react'

/**
 * CounterWidget - Sayaç widget'ı
 * @param {object} props - Widget props
 * @param {string} props.title - Başlık
 * @param {number} props.initialValue - Başlangıç değeri
 * @param {number} props.step - Artış/azalış miktarı
 */
export default function CounterWidget({ 
    title = 'Counter',
    initialValue = 0,
    step = 1 
}) {
    const [count, setCount] = useState(initialValue)

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[hsl(var(--foreground))]">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <span className="text-4xl font-bold text-[hsl(var(--primary))]">
                    {count}
                </span>
                <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setCount(c => c - step)}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <Button 
                        size="sm"
                        onClick={() => setCount(c => c + step)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
```

---

## Registry'ye Kayıt

### Adım 3: Widget'ı Registry'ye Ekle

`src/widgets/registry.js` dosyasını düzenleyin:

```jsx
// Import ekle
const CounterWidget = lazy(() => import('./components/CounterWidget'))

// Registry'ye kaydet
registerWidget({
    id: 'counter-widget',           // Benzersiz ID
    title: 'Counter',               // Görünen isim
    description: 'Interactive counter', // Açıklama
    icon: 'hash',                   // lucide-react icon adı
    component: CounterWidget,       // Component referansı
    category: 'utilities',          // Kategori: statistics, data, charts, utilities, media, social
    defaultProps: {                 // Varsayılan props
        title: 'Counter',
        initialValue: 0,
        step: 1,
    },
    permissions: [],                // Opsiyonel: [Roles.ADMIN, Roles.USER]
})
```

### Kategori Seçenekleri

| Kategori | Açıklama | Örnekler |
|----------|----------|----------|
| `statistics` | Metrik ve KPI'lar | StatCard, ProgressCard |
| `data` | Tablo ve listeler | SimpleTable, ActivityFeed |
| `charts` | Grafikler | MiniChart, DonutChart |
| `utilities` | Araçlar | WorldClock, Calendar |
| `media` | Medya içeriği | ImageCard, VideoPlayer |
| `social` | Sosyal & Finans | SocialPost, StockTicker |

---

## Props ve Validasyon

### Default Props

Widget'ınızın her prop'u için varsayılan değerler tanımlayın:

```jsx
export default function MyWidget({ 
    title = 'Default Title',
    value = 0,
    showBorder = true,
    theme = 'default'
}) {
    // ...
}
```

### Props Dokümantasyonu

JSDoc ile props'ları belgeleyin:

```jsx
/**
 * @typedef {object} MyWidgetProps
 * @property {string} title - Widget başlığı
 * @property {number} value - Gösterilecek değer
 * @property {boolean} [showBorder=true] - Kenarlık göster
 * @property {'default'|'minimal'|'detailed'} [theme='default'] - Tema
 */

/**
 * MyWidget - Custom widget açıklaması
 * @param {MyWidgetProps} props
 */
export default function MyWidget(props) {
    // ...
}
```

---

## Tema Entegrasyonu

### CSS Variables Kullanımı

Tema uyumluluğu için CSS variables kullanın:

```jsx
// ✅ Doğru - Tema uyumlu
<div className="bg-[hsl(var(--background))]">
    <span className="text-[hsl(var(--foreground))]">Text</span>
    <span className="text-[hsl(var(--muted-foreground))]">Muted</span>
</div>

// ❌ Yanlış - Sabit renkler
<div className="bg-white">
    <span className="text-black">Text</span>
</div>
```

### Kullanılabilir CSS Variables

| Variable | Açıklama |
|----------|----------|
| `--background` | Ana arkaplan |
| `--foreground` | Ana metin |
| `--card` | Kart arkaplanı |
| `--primary` | Birincil renk |
| `--secondary` | İkincil renk |
| `--muted` | Pasif arkaplan |
| `--muted-foreground` | Pasif metin |
| `--accent` | Vurgu rengi |
| `--destructive` | Hata/silme rengi |
| `--border` | Kenarlık |
| `--radius` | Köşe yuvarlaklığı |

---

## İyi Pratikler

### 1. Responsive Tasarım

```jsx
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    {/* İçerik */}
</div>
```

### 2. Loading States

```jsx
const [loading, setLoading] = useState(true)

if (loading) {
    return (
        <Card className="h-full animate-pulse">
            <CardContent className="p-4">
                <div className="h-4 bg-[hsl(var(--muted))] rounded w-3/4" />
            </CardContent>
        </Card>
    )
}
```

### 3. Error Handling

```jsx
const [error, setError] = useState(null)

if (error) {
    return (
        <Card className="h-full border-[hsl(var(--destructive))]">
            <CardContent className="p-4 text-center">
                <AlertCircle className="h-8 w-8 text-[hsl(var(--destructive))] mx-auto mb-2" />
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{error}</p>
            </CardContent>
        </Card>
    )
}
```

### 4. Accessibility

```jsx
<Button 
    aria-label="Increase counter"
    onClick={handleIncrease}
>
    <Plus className="h-4 w-4" />
</Button>
```

### 5. h-full Kullanımı

Widget'ların grid içinde düzgün görünmesi için `h-full` kullanın:

```jsx
<Card className="h-full">
    {/* Card içinde flex-1 veya min-h değerleri */}
</Card>
```

---

## Örnek Widgetlar

Referans için mevcut widget'ları inceleyin:

| Widget | Karmaşıklık | Öğrenilecek |
|--------|-------------|-------------|
| `StatCard.jsx` | Basit | Temel yapı |
| `MiniChart.jsx` | Orta | SVG kullanımı |
| `WorldClock.jsx` | Orta | useEffect, intervals |
| `ServerMonitor.jsx` | Karmaşık | Real-time updates |
| `PollWidget.jsx` | Karmaşık | State management |

---

## Checklist ✅

Yeni widget oluştururken kontrol edin:

- [ ] Component dosyası oluşturuldu
- [ ] Registry'ye kayıt yapıldı
- [ ] Default props tanımlandı
- [ ] Tema CSS variables kullanıldı
- [ ] h-full class eklendi
- [ ] JSDoc yorumları yazıldı
- [ ] Loading state var
- [ ] Error handling var
- [ ] Responsive test edildi
- [ ] Dark mode test edildi

---

## Yardım

Sorularınız için:
- GitHub Issues: [Repo Issues](https://github.com/brkdnz/multitenant-dashboard/issues)
- Mevcut widget kodlarını inceleyin: `src/widgets/components/`
