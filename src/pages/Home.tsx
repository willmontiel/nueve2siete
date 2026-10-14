import { Hero } from '../components/home/Hero'
import { HowToOrder } from '../components/home/HowToOrder'
import { Garland } from '../components/garland/Garland'

export function Home() {
  return (
    // overflow-x-clip, not overflow-hidden: a scroll container here would stop the garland from pinning
    <div className="relative overflow-x-clip">
      <Hero />
      <Garland />
      <HowToOrder />
    </div>
  )
}
