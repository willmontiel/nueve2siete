import type { Field } from '../../data/products'

// The colour fields of the posters and the product stage, written out whole so Tailwind finds every class. Each
// carries its faint ribbon one shade darker than the field, as the ribbon behind the logo on page 3 of the guide.
export const FIELDS: Record<Field, { bg: string; ribbon: string }> = {
  lavender: { bg: 'bg-lavender', ribbon: 'text-[color-mix(in_srgb,var(--color-lavender),var(--color-ink)_9%)]' },
  mustard: { bg: 'bg-mustard', ribbon: 'text-[color-mix(in_srgb,var(--color-mustard),var(--color-ink)_9%)]' },
  pink: { bg: 'bg-pink', ribbon: 'text-[color-mix(in_srgb,var(--color-pink),var(--color-ink)_9%)]' },
  lime: { bg: 'bg-lime', ribbon: 'text-[color-mix(in_srgb,var(--color-lime),var(--color-ink)_9%)]' },
}
