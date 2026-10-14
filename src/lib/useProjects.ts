import { useEffect, useState } from 'react'
import { PROJECTS, type Project } from '../data/projects'
import { projectsFromRows, type ProjectRow } from './projectRows'
import { getSupabase } from './supabase'

const COLUMNS = 'id, title, occasion, summary, photo, photo_alt, photo_position, color, color_ids, product_slug'
// A paused free-plan project can hang instead of failing; the garland stops waiting after this
const TIMEOUT_MS = 5000

let loaded: Project[] | undefined
let loading: Promise<Project[] | undefined> | undefined

// The published projects, asked once per visit. Undefined when Supabase is not set up, fails, or has none yet.
function loadProjects() {
  loading ??= (async () => {
    try {
      const supabase = await getSupabase()
      if (!supabase) return undefined
      const { data, error } = await supabase
        .from('projects')
        .select(COLUMNS)
        .eq('published', true)
        .order('sort_order')
        .order('created_at')
        .abortSignal(AbortSignal.timeout(TIMEOUT_MS))
      if (error) throw error
      const projects = projectsFromRows(
        data as ProjectRow[],
        path => supabase.storage.from('projects').getPublicUrl(path).data.publicUrl,
      )
      if (projects.length) loaded = projects
      return loaded
    } catch (error) {
      console.warn('The projects could not be loaded from Supabase', error)
      return undefined
    }
  })()
  return loading
}

/** The garland's projects: the local list at first, replaced by the ones in Supabase once they arrive */
export function useProjects(): Project[] {
  const [projects, setProjects] = useState(() => loaded ?? PROJECTS)
  useEffect(() => {
    let live = true
    loadProjects().then(fresh => {
      if (live && fresh) setProjects(fresh)
    })
    return () => {
      live = false
    }
  }, [])
  return projects
}
