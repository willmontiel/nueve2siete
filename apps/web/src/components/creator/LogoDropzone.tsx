'use client'

import React, { useState } from 'react'

import { UploadIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import { ACCEPTED_LOGO_TYPES } from '@/lib/engine/upload'

/** Area to drop or pick the logo file. With the keyboard, the (visually hidden) input gets focus. */
export function LogoDropzone({
  onFile,
  disabled,
  compact,
}: {
  onFile: (file: File) => void
  disabled?: boolean
  compact?: boolean
}) {
  const [dragging, setDragging] = useState(false)

  return (
    <label
      onDragOver={(event) => {
        event.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        const file = event.dataTransfer.files[0]
        if (file && !disabled) onFile(file)
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed text-center transition-colors focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-lilac-deep',
        compact ? 'min-h-14 flex-row px-5 py-3' : 'min-h-48 px-6 py-8',
        dragging ? 'border-lilac-deep bg-tint-lilac' : 'border-ink/25 bg-snow hover:border-ink/50',
        disabled && 'pointer-events-none opacity-60',
      )}
    >
      <input
        type="file"
        name="logo"
        accept={ACCEPTED_LOGO_TYPES.join(',')}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0]
          // Clear the input so picking the same file again also fires the change.
          event.target.value = ''
          if (file) onFile(file)
        }}
      />
      <UploadIcon className={compact ? 'size-5' : 'size-8'} />
      {compact ? (
        <span className="font-semibold">Subir otro logo</span>
      ) : (
        <>
          <span className="text-lg font-semibold">
            Arrastra tu logo aquí o <span className="underline underline-offset-4">elige un archivo</span>
          </span>
          <span className="text-sm text-muted">PNG, JPG, WebP o GIF · hasta 10 MB</span>
        </>
      )}
    </label>
  )
}
