import { notFound } from 'next/navigation'

// Any unknown route shows the site's 404 (with header and footer).
export default function CatchAll() {
  notFound()
}
