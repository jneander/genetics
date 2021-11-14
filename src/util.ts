export function shuffleArray<T = any>(array: T[]): T[] {
  for (let i = array.length; i; i--) {
    let j = Math.floor(Math.random() * i)
    ;[array[i - 1], array[j]] = [array[j], array[i - 1]]
  }
  return array
}

export function shuffleString(string: string): string {
  return shuffleArray(string.split('')).join('')
}

export function randomInt(min: number, max: number) {
  const minInt = Math.ceil(min)
  const maxInt = Math.floor(max)
  return Math.floor(Math.random() * (maxInt - minInt)) + minInt
}

export function sampleString(string: string, count = 1): string {
  return shuffleString(string).slice(0, count)
}

export function sampleArray<T = any>(array: T[], count = 1): T[] {
  return shuffleArray<T>(array).slice(0, count)
}

/**
 * @param array An array of values.
 * @returns One element of the array at random.
 */
export function randomEntry<T = any>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function range(start: number, end: number): number[] {
  return Array.from({length: end - start}, (_, key) => key + start)
}

export function sum(array: number[]): number {
  return array.reduce((sum, value) => sum + value, 0)
}

export function product(array: number[]): number {
  return array.reduce((sum, value) => sum * value, 1)
}
