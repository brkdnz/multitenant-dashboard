# ADR-002: Backend için Supabase Kullanımı

**Tarih**: 2026-01-01  
**Durum**: Kabul Edildi

## Bağlam

Dashboard builder'ın tenant konfigürasyonları, layout'lar ve kullanıcı verileri için bir backend'e ihtiyacı var. Hızlı prototipleme ve MVP için self-hosted backend geliştirmek yerine BaaS (Backend as a Service) değerlendirildi.

## Karar

Backend servisi olarak **Supabase** kullanılmasına karar verildi.

## Alternatifler

### Custom Node.js Backend
- ✅ Tam kontrol
- ✅ Özel iş mantığı
- ❌ Geliştirme süresi uzun
- ❌ Deployment ve bakım maliyeti
- ❌ Auth, realtime manuel implement

### Firebase
- ✅ Google ekosistemi
- ✅ Realtime database
- ❌ NoSQL (ilişkisel veri zor)
- ❌ Vendor lock-in
- ❌ Egress maliyetleri yüksek

### Supabase (Seçilen)
- ✅ PostgreSQL (SQL, ilişkisel)
- ✅ Built-in Auth
- ✅ Row Level Security
- ✅ Realtime subscriptions
- ✅ Auto-generated REST API
- ✅ Açık kaynak, self-host mümkün
- ✅ Ücretsiz tier yeterli

### PlanetScale / Neon
- ✅ Serverless SQL
- ❌ Sadece database (auth yok)
- ❌ Ek servisler gerekli

## Sonuçlar

### Olumlu
- Backend development süresi %80 azaldı
- Auth, RLS, API otomatik
- Local development için ücretsiz
- İleride self-host edilebilir

### Olumsuz
- Supabase'e bağımlılık
- Kompleks query'ler için limitation
- Egress limitleri (free tier)

## Veritabanı Şeması

```sql
-- Tenants tablosu
CREATE TABLE tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Layouts tablosu  
CREATE TABLE layouts (
    tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
    page_id TEXT NOT NULL,
    widgets JSONB DEFAULT '[]',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (tenant_id, page_id)
);
```

## RLS Politikaları

```sql
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON tenants FOR ALL USING (true);
```

> **Not**: Production'da user-based RLS politikaları eklenecek.
