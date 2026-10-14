import { Hero } from '../components/home/Hero'
import { HowToOrder } from '../components/home/HowToOrder'
import { Garland } from '../components/garland/Garland'
import { useProjects } from '../lib/useProjects'
import { HOME_META } from '../lib/meta'
import { usePageMeta } from '../lib/usePageMeta'

export function Home() {
  usePageMeta(HOME_META)
  const projects = useProjects()
  return (
    // overflow-x-clip, not overflow-hidden: a scroll container here would stop the garland from pinning
    <div className="relative overflow-x-clip">
      <Hero />
      <Garland projects={projects} />
      <HowToOrder />
    </div>
  )
}
