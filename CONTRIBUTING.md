# Katkıda Bulunma Rehberi

Multi-Tenant Dashboard Builder projesine katkıda bulunmak istediğiniz için teşekkür ederiz! 🎉

## 📋 İçindekiler

- [Davranış Kuralları](#davranış-kuralları)
- [Nasıl Katkıda Bulunabilirim?](#nasıl-katkıda-bulunabilirim)
- [Geliştirme Ortamı](#geliştirme-ortamı)
- [Kod Standartları](#kod-standartları)
- [Pull Request Süreci](#pull-request-süreci)
- [Commit Mesajları](#commit-mesajları)

---

## Davranış Kuralları

Bu proje, herkesin saygı gördüğü ve hoş karşılandığı bir ortam oluşturmayı amaçlar. Lütfen:

- **Saygılı olun**: Farklı görüşlere ve deneyimlere saygı gösterin
- **Yapıcı olun**: Eleştirileriniz yapıcı ve yardımcı olsun
- **Kapsayıcı olun**: Herkesin katkıda bulunabileceği bir ortam oluşturun

---

## Nasıl Katkıda Bulunabilirim?

### 🐛 Bug Raporlama

1. [GitHub Issues](https://github.com/brkdnz/multitenant-dashboard/issues) sayfasını kontrol edin
2. Aynı bug daha önce raporlanmamışsa yeni issue açın
3. Şu bilgileri ekleyin:
   - Bug'ın açık bir açıklaması
   - Tekrarlama adımları
   - Beklenen davranış vs gerçekleşen davranış
   - Ekran görüntüleri (varsa)
   - Tarayıcı/OS bilgileri

### 💡 Özellik Önerisi

1. "Feature Request" etiketi ile yeni issue açın
2. Özelliğin ne olduğunu açıklayın
3. Neden faydalı olacağını belirtin
4. Mümkünse tasarım önerileri ekleyin

### 🔧 Kod Katkısı

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi yapın
4. Test edin
5. Commit yapın (`git commit -m 'feat: add amazing feature'`)
6. Push edin (`git push origin feature/amazing-feature`)
7. Pull Request açın

---

## Geliştirme Ortamı

### Gereksinimler

- Node.js 18+
- npm 9+
- Git

### Kurulum

```bash
# Repo'yu klonlayın
git clone https://github.com/brkdnz/multitenant-dashboard.git
cd multitenant-dashboard

# Bağımlılıkları yükleyin
npm install

# Environment dosyasını oluşturun
cp .env.example .env

# Geliştirme sunucusunu başlatın
npm run dev
```

### Proje Yapısı

```
src/
├── app/              # Zustand store
├── auth/             # Authentication
├── components/       # UI bileşenleri
│   ├── admin/        # Admin panel bileşenleri
│   ├── dnd/          # Drag-drop
│   ├── layout/       # Layout (Sidebar, Header)
│   └── ui/           # Temel UI (Button, Card, etc.)
├── config/           # Konfigürasyon
│   ├── adapters/     # Storage adapters
│   └── tenants/      # Tenant configs
├── hooks/            # Custom hooks
├── i18n/             # Internationalization
├── lib/              # Utility functions
├── pages/            # Sayfa bileşenleri
├── tenancy/          # Multi-tenant logic
└── widgets/          # Widget sistemi
    ├── components/   # Widget bileşenleri
    └── registry.js   # Widget registry
```

---

## Kod Standartları

### JavaScript/React

- **ESLint** kurallarına uyun
- **Functional components** kullanın
- **React Hooks** kullanın (class components değil)
- **Default exports** yerine **named exports** tercih edin (pages hariç)

### Dosya İsimlendirme

| Tür | Format | Örnek |
|-----|--------|-------|
| Component | PascalCase | `UserProfile.jsx` |
| Hook | camelCase, use prefix | `useAuth.js` |
| Utility | camelCase | `formatDate.js` |
| Constant | UPPER_SNAKE_CASE | `API_ENDPOINTS.js` |

### CSS/Styling

- **Tailwind CSS** kullanın
- Tema uyumluluğu için **CSS variables** kullanın
- Inline styles yerine **className** kullanın

```jsx
// ✅ Doğru
<div className="bg-[hsl(var(--background))] p-4 rounded-lg">

// ❌ Yanlış
<div style={{ backgroundColor: 'white', padding: '16px' }}>
```

### Import Sırası

```jsx
// 1. React ve React ilişkili
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// 2. Third-party libraries
import { z } from 'zod'

// 3. Aliased imports (@/)
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// 4. Relative imports
import { MyComponent } from './MyComponent'
```

---

## Pull Request Süreci

### PR Açmadan Önce

1. ✅ Kodunuz lint hatası vermiyor (`npm run lint`)
2. ✅ Uygulama build oluyor (`npm run build`)
3. ✅ Yeni özellik veya fix test edildi
4. ✅ Gerekiyorsa dokümantasyon güncellendi

### PR Template

```markdown
## Açıklama
Bu PR ne yapıyor?

## Değişiklik Türü
- [ ] Bug fix
- [ ] Yeni özellik
- [ ] Breaking change
- [ ] Dokümantasyon

## Test
Nasıl test edildi?

## Ekran Görüntüleri
(UI değişiklikleri için)

## Checklist
- [ ] Kod self-review yapıldı
- [ ] Lint hatası yok
- [ ] Build başarılı
```

### Review Süreci

1. Maintainer PR'ı inceler
2. Gerekiyorsa değişiklik talep edilir
3. Onay sonrası merge yapılır

---

## Commit Mesajları

[Conventional Commits](https://www.conventionalcommits.org/) formatını kullanıyoruz:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Açıklama |
|------|----------|
| `feat` | Yeni özellik |
| `fix` | Bug fix |
| `docs` | Dokümantasyon |
| `style` | Formatting, noktalı virgül vb. |
| `refactor` | Kod refactoring |
| `perf` | Performans iyileştirmesi |
| `test` | Test ekleme |
| `chore` | Build, CI/CD, deps |

### Örnekler

```bash
feat(widgets): add HeatmapCalendar widget
fix(sidebar): mobile menu not closing on navigation
docs: update CONTRIBUTING.md with commit guidelines
refactor(store): simplify tenant slice logic
perf(widgets): lazy load all widget components
```

---

## Widget Katkısı

Yeni widget eklemek istiyorsanız:

1. [WIDGET_GUIDE.md](./WIDGET_GUIDE.md) dosyasını okuyun
2. `src/widgets/components/` altında widget oluşturun
3. `src/widgets/registry.js`'e kaydedin
4. PR açın

---

## Sorular?

- **GitHub Issues**: Bug ve özellik istekleri
- **GitHub Discussions**: Genel sorular ve tartışmalar

Katkınız için teşekkürler! 🙏
