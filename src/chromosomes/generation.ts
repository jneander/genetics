import {sampleArray} from '../util'
import {Chromosome} from './chromosome'

/**
 * Create a Chromosome by randomly selecting genes for each position up to the given length.
 *
 * @template GeneType
 * @param {number} length The length of the Chromosome to be created.
 * @param {GeneType[]} geneSet The available genes to select from when populating the Chromosome.
 * @returns A new Chromosome instance.
 */
export function randomChromosome<GeneType>(length: number, geneSet: GeneType[]) {
  let genes: GeneType[] = []

  while (genes.length < length) {
    const sampleSize = Math.min(length - genes.length, geneSet.length)
    genes = genes.concat(sampleArray(geneSet, sampleSize))
  }

  return new Chromosome<GeneType>(genes)
}
