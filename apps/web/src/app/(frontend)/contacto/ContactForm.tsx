'use client'

import Link from 'next/link'
import React, { useActionState } from 'react'

import { CheckIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

import { submitContact, type ContactState } from './actions'

const initialState: ContactState = { status: 'idle' }

const input =
  'mt-2 block w-full rounded-2xl bg-snow px-4 text-base ring-1 ring-ink/15 outline-none placeholder:text-muted focus:ring-2 focus:ring-lilac-deep aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-orange-deep'

export function ContactForm({ initialMessage = '' }: { initialMessage?: string }) {
  const [state, formAction, pending] = useActionState(submitContact, initialState)
  const errors = state.fieldErrors ?? {}
  const values = state.values ?? {}

  if (state.status === 'success') {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-[32px] bg-tint-green p-8">
        <span className="flex size-12 items-center justify-center rounded-full bg-ink text-cream">
          <CheckIcon className="size-6" />
        </span>
        <h2 className="text-2xl font-semibold">¡Gracias! Recibimos tu mensaje.</h2>
        <p className="text-lg text-ink-soft">Te responderemos lo antes posible.</p>
      </div>
    )
  }

  const field = (name: string) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      {state.status === 'error' && state.message && (
        <p role="alert" className="rounded-2xl bg-tint-orange px-5 py-4 font-medium">
          {state.message}
        </p>
      )}

      <div>
        <label htmlFor="name" className="font-semibold">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          defaultValue={values.name}
          className={cn(input, 'min-h-12')}
          {...field('name')}
        />
        <FieldError name="name" errors={errors} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="font-semibold">
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={values.email}
            className={cn(input, 'min-h-12')}
            {...field('email')}
          />
          <FieldError name="email" errors={errors} />
        </div>
        <div>
          <label htmlFor="whatsapp" className="font-semibold">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            defaultValue={values.whatsapp}
            className={cn(input, 'min-h-12')}
            {...field('whatsapp')}
          />
          <FieldError name="whatsapp" errors={errors} />
        </div>
      </div>
      {!errors.email && (
        <p className="-mt-3 text-sm text-muted">Déjanos al menos uno de los dos para responderte.</p>
      )}

      <div>
        <label htmlFor="interest" className="font-semibold">
          ¿Qué te interesa?
        </label>
        <select
          id="interest"
          name="interest"
          defaultValue={values.interest ?? 'microphone'}
          className={cn(input, 'min-h-12 appearance-none')}
          {...field('interest')}
        >
          <option value="microphone">Micrófono personalizado</option>
          <option value="other">Otro proyecto</option>
        </select>
        <FieldError name="interest" errors={errors} />
      </div>

      <div>
        <label htmlFor="message" className="font-semibold">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          defaultValue={values.message ?? initialMessage}
          placeholder="Cuéntanos de tu marca, el tamaño, los colores, cuántos necesitas y para cuándo."
          className={cn(input, 'py-3')}
          {...field('message')}
        />
        <FieldError name="message" errors={errors} />
      </div>

      {/* Honeypot field for bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Empresa</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex items-start gap-3 text-[15px] leading-relaxed">
          <input
            name="consent"
            type="checkbox"
            required
            className="mt-1 size-5 shrink-0 accent-ink"
            {...field('consent')}
          />
          <span>
            Autorizo el tratamiento de mis datos personales según la{' '}
            <Link href="/legal/tratamiento-de-datos" className="font-semibold underline underline-offset-4">
              política de tratamiento de datos
            </Link>
            .
          </span>
        </label>
        <FieldError name="consent" errors={errors} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 items-center justify-center self-start rounded-full bg-ink px-8 font-semibold text-cream transition-colors hover:bg-ink-soft disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? 'Enviando…' : 'Enviar mensaje'}
      </button>
    </form>
  )
}

function FieldError({ name, errors }: { name: string; errors: Partial<Record<string, string[]>> }) {
  const message = errors[name]?.[0]
  if (!message) return null
  return (
    <p id={`${name}-error`} className="mt-1.5 text-sm font-medium text-orange-deep">
      {message}
    </p>
  )
}
