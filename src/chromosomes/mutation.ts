import {rangeInts} from '@jneander/utils-arrays'
import {RandomUint32Fn, sampleArrayIndices, sampleArrayValues} from '@jneander/utils-random'

import {randomInt} from '../util'
import {Chromosome} from './chromosome'

/**
 * Options for governing the `replaceOneGene` mutation function.
 */
export interface ReplaceOneGeneOptions {
  /**
   * An optional function which returns an unsigned 32-bit integer. The function
   * must accept an inclusive minimum and exclusive maximum to be the boundaries
   * of the returned value. This function defaults to one which uses
   * `Math.random` and does not eliminate bias.
   */
  randomUint32Fn?: RandomUint32Fn
}

/**
 * A function which returns a Chromosome derived from the given Chromosome in
 * which one randomly-selected Gene has been replaced with one randomly selected
 * from the given Gene set.
 *
 * @export
 * @template GeneType
 * @param {Chromosome<GeneType>} chromosome The Chromosome from which the
 * mutated Chromosome will be derived.
 * @param {GeneType[]} geneSet The available Genes to select from when
 * replacing a Gene within the Chromosome.
 * @param {RandomUint32Fn} [options.randomUint32Fn] An optional function which
 * returns an unsigned 32-bit integer. The function must accept an inclusive
 * minimum and exclusive maximum to be the boundaries of the returned value.
 * This function defaults to one which uses `Math.random` and does not eliminate
 * bias.
 *
 * @returns {Chromosome<GeneType>} A new Chromosome instance with one Gene
 * replaced.
 */
export function replaceOneGene<GeneType>(
  chromosome: Chromosome<GeneType>,
  geneSet: GeneType[],
  options: ReplaceOneGeneOptions = {}
): Chromosome<GeneType> {
  const {randomUint32Fn = randomInt} = options

  const index = randomUint32Fn(0, chromosome.genes.length)
  const [newGene, alternate] = sampleArrayValues(geneSet, {count: 2, randomUint32Fn, unique: true})
  const mutationGenes = [...chromosome.genes]

  if (mutationGenes[index] === newGene) {
    mutationGenes[index] = alternate
  } else {
    mutationGenes[index] = newGene
  }

  return new Chromosome<GeneType>(mutationGenes)
}

/**
 * Options for governing the `swapTwoGenes` mutation function.
 */
export interface SwapTwoGenesOptions {
  randomUint32Fn?: RandomUint32Fn
}

/**
 * A function which returns a Chromosome derived from the given Chromosome in
 * which two randomly-selected Genes have swapped positions.
 *
 * @export
 * @template GeneType
 * @param {Chromosome<GeneType>} chromosome The Chromosome from which the
 * mutated Chromosome will be derived.
 * @param {RandomUint32Fn} [options.randomUint32Fn] An optional function which
 * returns an unsigned 32-bit integer. The function must accept an inclusive
 * minimum and exclusive maximum to be the boundaries of the returned value.
 * This function defaults to one which uses `Math.random` and does not eliminate
 * bias.
 *
 * @returns {Chromosome<GeneType>} A new Chromosome instance with two Genes
 * having swapped positions.
 */
export function swapTwoGenes<GeneType>(
  chromosome: Chromosome<GeneType>,
  options: SwapTwoGenesOptions = {}
): Chromosome<GeneType> {
  const {randomUint32Fn = randomInt} = options

  const mutationGenes = [...chromosome.genes]

  const [indexA, indexB] = sampleArrayIndices(
    rangeInts(0, chromosome.genes.length, {exclusiveEnd: true}),

    {
      count: 2,
      randomUint32Fn,
      unique: true
    }
  )

  mutationGenes[indexA] = chromosome.genes[indexB]
  mutationGenes[indexB] = chromosome.genes[indexA]

  return new Chromosome<GeneType>(mutationGenes)
}
