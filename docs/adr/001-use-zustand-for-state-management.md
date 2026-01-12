# ADR-001: State Management için Zustand Kullanımı

**Tarih**: 2026-01-01  
**Durum**: Kabul Edildi

## Bağlam

Uygulama için global state management çözümüne ihtiyaç var. Tenant konfigürasyonları, tema ayarları, sidebar durumu ve drag-drop state'i yönetilmeli.

## Karar

State management için **Zustand** kullanılmasına karar verildi.

## Alternatifler

### Redux Toolkit
- ✅ Endüstri standardı, büyük ekosistem
- ✅ Redux DevTools desteği
- ❌ Çok fazla boilerplate kod
- ❌ Actions, reducers, selectors setup'ı zahmetli

### React Context + useReducer
- ✅ Ek bağımlılık yok
- ✅ Basit projeler için yeterli
- ❌ Performance issues (tüm tree re-render)
- ❌ Persist middleware yok

### Zustand (Seçilen)
- ✅ Minimal boilerplate
- ✅ Built-in persist middleware
- ✅ TypeScript olmadan da iyi DX
- ✅ Küçük bundle size (~1KB)
- ✅ Modüler slice pattern

### Jotai / Recoil
- ✅ Atomic model
- ❌ Öğrenme eğrisi
- ❌ Daha az yaygın

## Sonuçlar

### Olumlu
- %70 daha az boilerplate Redux'a göre
- `localStorage` persist'i tek satırda
- Slice pattern ile modüler yapı
- DevTools entegrasyonu mevcut

### Olumsuz
- Redux kadar yaygın değil
- Bazı geliştiriciler için yeni olabilir

## Örnek Kod

```javascript
// store.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
    persist(
        (set, get) => ({
            // State
            currentTenantId: null,
            tenants: {},
            
            // Actions
            setCurrentTenant: (id) => set({ currentTenantId: id }),
            loadTenant: (id, config) => set(state => ({
                tenants: { ...state.tenants, [id]: config }
            })),
        }),
        { name: 'dashboard-store' }
    )
)
```
