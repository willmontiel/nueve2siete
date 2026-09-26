import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'

export const alt = 'nueve2siete · Micrófonos personalizados impresos en 3D'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  const logo = await readFile(path.join(process.cwd(), 'public/brand/nueve2siete-logo.png'))
  const src = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 48,
          background: '#F0F0EB',
        }}
      >
        <img src={src} width={744} height={236} alt="" />
        <div style={{ fontSize: 40, color: '#4A443C' }}>Micrófonos personalizados impresos en 3D</div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ width: 96, height: 16, borderRadius: 8, background: '#E95C21' }} />
          <div style={{ width: 96, height: 16, borderRadius: 8, background: '#A9B6EE' }} />
          <div style={{ width: 96, height: 16, borderRadius: 8, background: '#E9BF0F' }} />
        </div>
      </div>
    ),
    size,
  )
}
