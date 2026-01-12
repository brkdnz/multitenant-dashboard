# Architecture Decision Records

Bu klasör, Multi-Tenant Dashboard Builder projesindeki önemli mimari kararları belgeler.

## ADR Nedir?

Architecture Decision Record (ADR), yazılım mimarisine ilişkin önemli kararları belgeleyen kısa metin dosyalarıdır.

## ADR Listesi

| ADR | Karar | Durum |
|-----|-------|-------|
| [ADR-001](./001-use-zustand-for-state-management.md) | State management için Zustand | Kabul Edildi |
| [ADR-002](./002-use-supabase-for-backend.md) | Backend için Supabase | Kabul Edildi |
| [ADR-003](./003-multi-tenant-architecture.md) | Multi-tenant mimari tasarımı | Kabul Edildi |
| [ADR-004](./004-widget-system-design.md) | Widget sistemi tasarımı | Kabul Edildi |
| [ADR-005](./005-storage-adapter-pattern.md) | Storage adapter pattern | Kabul Edildi |

## ADR Template

Yeni ADR oluşturmak için:

```markdown
# ADR-XXX: [Başlık]

## Bağlam
Problem ve mevcut durum

## Karar
Alınan karar

## Alternatifler
Değerlendirilen diğer seçenekler

## Sonuçlar
Olumlu ve olumsuz etkiler

## Durum
Kabul Edildi / Reddedildi / Değiştirildi
```
