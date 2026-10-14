// The flower of the theme switch, drawn like the clicker: six round petals round a centre, in a 100-unit box.
// The same flower is the mask the new theme blooms through when it is switched (ThemeSwitch.tsx, index.css).

export const FLOWER = {
  petals: 6,
  /** Distance from the middle of the box to the centre of each petal */
  ring: 27,
  /** Radius of each petal */
  petal: 22,
  /** Radius of the centre, the button of the clicker */
  centre: 20,
}

export function petalCentres() {
  return Array.from({ length: FLOWER.petals }, (_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / FLOWER.petals
    return { x: 50 + Math.cos(angle) * FLOWER.ring, y: 50 + Math.sin(angle) * FLOWER.ring }
  })
}

/** How far from the middle the outline dips in, between two petals: the flower covers this whole circle */
export function valleyRadius() {
  const half = Math.PI / FLOWER.petals
  return FLOWER.ring * Math.cos(half) + Math.sqrt(FLOWER.petal ** 2 - (FLOWER.ring * Math.sin(half)) ** 2)
}

const maskSvg =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>" +
  petalCentres()
    .map(({ x, y }) => `<circle cx='${x.toFixed(2)}' cy='${y.toFixed(2)}' r='${FLOWER.petal}'/>`)
    .join('') +
  `<circle cx='50' cy='50' r='${FLOWER.centre}'/></svg>`

/** The flower's silhouette as a CSS image */
export const FLOWER_MASK = `url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")`

/** Side in px of the flower centred on (x, y) that covers the whole screen, with a little to spare */
export function bloomSize(x: number, y: number, width: number, height: number) {
  const farthest = Math.hypot(Math.max(x, width - x), Math.max(y, height - y))
  return Math.ceil(((farthest / valleyRadius()) * 100) * 1.05)
}
