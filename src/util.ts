/**
 * A function which returns a random, unsigned 32-bit integer. This function
 * uses `Math.random` and does not eliminate bias. It is intended for use as an
 * internal fallback for random number generation.
 *
 * @param {number} [minInclusive] A lower limit (inclusive) which the returned
 * value will be at least. Cannot be below `0`.
 * @param {number} [maxExclusive] An upper limit (exclusive) below which the
 * returned number will be constrained. Cannot exceed `4294967296`.
 *
 * @returns {number} An unsigned 32-bit integer.
 */
export function randomInt(minInclusive: number, maxExclusive: number) {
  const minInt = Math.ceil(minInclusive)
  const maxInt = Math.floor(maxExclusive)

  return (Math.floor(Math.random() * (maxInt - minInt)) + minInt) >>> 0
}
