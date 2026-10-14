/**
 * The share of a scroll progress in which letter `index` of `count` leaves, so the letters of a line leave
 * one after another, in reading order, between `start` and `end`. Each takes `length` of the progress.
 */
export function letterWindow(index: number, count: number, [start, end]: [number, number], length: number): [number, number] {
  const from = count > 1 ? start + ((end - start - length) * index) / (count - 1) : start
  return [from, from + length]
}
