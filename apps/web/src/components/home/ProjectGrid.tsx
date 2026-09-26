import type { Media, Project } from '@nueve2siete/cms'
import Image from 'next/image'
import React from 'react'

import { mediaUrl } from '@/lib/media'

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const image = typeof project.image === 'object' ? (project.image as Media) : null
        return (
          <li key={project.id} className="flex flex-col gap-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-sand">
              {image?.filename && (
                <Image
                  src={mediaUrl(image.filename)}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{project.title}</h3>
              {project.description && <p className="text-[15px] text-ink-soft">{project.description}</p>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
