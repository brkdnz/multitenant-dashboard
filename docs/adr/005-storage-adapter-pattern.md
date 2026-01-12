# ADR-005: Storage Adapter Pattern

**Tarih**: 2026-01-01  
**Durum**: Kabul Edildi

## Bağlam

Uygulama hem local development (localStorage) hem de production (Supabase veya başka backend) ortamını desteklemeli. Storage mekanizması değiştiğinde uygulama kodunun değişmemesi gerekiyor.

## Karar

**Adapter Pattern** kullanılarak storage mekanizmasının soyutlanmasına karar verildi.

## Tasarım

### Adapter Interface

```javascript
// Her adapter şu metodları implement etmeli:
{
    async get(key): Promise<any>
    async set(key, value): Promise<void>
    async delete(key): Promise<void>
    async keys(pattern): Promise<string[]>
}
```

### LocalStorage Adapter

```javascript
// LocalStorageAdapter.js
export const localStorageAdapter = {
    async get(key) {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
    },
    
    async set(key, value) {
        localStorage.setItem(key, JSON.stringify(value))
    },
    
    async delete(key) {
        localStorage.removeItem(key)
    },
    
    async keys(pattern) {
        const prefix = pattern.replace('*', '')
        return Object.keys(localStorage)
            .filter(k => k.startsWith(prefix))
    }
}
```

### Supabase Adapter

```javascript
// SupabaseAdapter.js
export const supabaseAdapter = {
    async get(key) {
        if (key.startsWith('tenant:')) {
            const id = key.replace('tenant:', '')
            const { data } = await supabase
                .from('tenants')
                .select('*')
                .eq('id', id)
                .single()
            return data?.config
        }
        return null
    },
    
    async set(key, value) {
        if (key.startsWith('tenant:')) {
            await supabase
                .from('tenants')
                .upsert({ id: key.replace('tenant:', ''), config: value })
        }
    },
    // ... diğer metodlar
}
```

### ConfigService

```javascript
// ConfigService.js
class ConfigService {
    constructor() {
        // Ortama göre adapter seç
        this.adapter = isSupabaseConfigured 
            ? supabaseAdapter 
            : localStorageAdapter
    }
    
    async getTenantConfig(id) {
        return this.adapter.get(`tenant:${id}`)
    }
    
    async saveTenantConfig(config) {
        return this.adapter.set(`tenant:${config.id}`, config)
    }
}
```

## Sonuçlar

### Olumlu
- Storage değişikliği tek satırda
- Test için mock adapter kullanılabilir
- Local development bağımsız çalışır
- Gelecekte farklı backend eklenebilir

### Olumsuz
- Adapter uyumu sağlanmalı
- Karmaşık query'ler her adapter'a özel
- Error handling her adapter'da farklı

## Kullanım Akışı

```
User Action
    ↓
ConfigService.saveTenantConfig(config)
    ↓
adapter.set('tenant:xyz', config)
    ↓
[LocalStorage] or [Supabase] or [Other]
```

## Test Strategy

```javascript
// Mock adapter for tests
const mockAdapter = {
    storage: new Map(),
    async get(k) { return this.storage.get(k) },
    async set(k, v) { this.storage.set(k, v) },
    async delete(k) { this.storage.delete(k) },
    async keys() { return [...this.storage.keys()] }
}
```
