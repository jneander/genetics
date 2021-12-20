import {RandomUint32Fn, sampleArrayValues} from '@jneander/utils-random'

import {randomInt} from '../util'
import {Chromosome} from './chromosome'

/**
 * Options for governing the `randomChromosome` generation function.
 */
export interface RandomChromosomeOptions {
  /**
   * An optional function which returns an unsigned 32-bit integer. The function
   * must accept an inclusive minimum and exclusive maximum to be the boundaries
   * of the returned value. This function defaults to one which uses
   * `Math.random` and does not eliminate bias.
   */
  randomUint32Fn?: RandomUint32Fn
}

/**
 * A function which returns a Chromosome created by randomly selecting Genes
 * from the given Gene set to populate the Gene sequence for the Chromosome up
 * to the given length.
 *
 * @export
 * @template GeneType
 *
 * @param {number} length The number of Genes to be selected for the returned
 * Chromosome.
 * @param {GeneType[]} geneSet The available Genes to select from when
 * populating the Chromosome.
 * @param {RandomUint32Fn} [options.randomUint32Fn] An optional function which
 * returns an unsigned 32-bit integer. The function must accept an inclusive
 * minimum and exclusive maximum to be the boundaries of the returned value.
 * This function defaults to one which uses `Math.random` and does not eliminate
 * bias.
 *
 * @returns {Chromosome<GeneType>} A Chromosome randomly populated with Genes.
 */
export function randomChromosome<GeneType>(
  length: number,
  geneSet: GeneType[],
  options: RandomChromosomeOptions = {}
): Chromosome<GeneType> {
  const genes = sampleArrayValues(geneSet, {
    count: length,
    randomUint32Fn: options.randomUint32Fn || randomInt,
    unique: false
  })

  return new Chromosome<GeneType>(genes)
}
