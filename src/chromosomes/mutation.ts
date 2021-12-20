import {randomInt, range, sampleArray} from '../util'
import {Chromosome} from './chromosome'

/**
 * Randomly replace one gene in the given Chromosome with another from the given
 * gene set.
 *
 * @template GeneType
 * @param {Chromosome<GeneType>} chromosome The Chromosome to mutate.
 * @param {GeneType[]} geneSet The available genes to select a replacement from.
 * @returns A new Chromosome instance with one gene replaced.
 */
export function replaceOneGene<GeneType>(chromosome: Chromosome<GeneType>, geneSet: GeneType[]) {
  const index = randomInt(0, chromosome.genes.length)
  const mutationGenes = [...chromosome.genes]
  const [newGene, alternate] = sampleArray(geneSet, 2)

  if (mutationGenes[index] === newGene) {
    mutationGenes[index] = alternate
  } else {
    mutationGenes[index] = newGene
  }

  return new Chromosome<GeneType>(mutationGenes)
}

/**
 * Randomly swap the positions of any two genes in the given Chromosome.
 *
 * @template GeneType
 * @param {Chromosome<GeneType>} chromosome The Chromosome to mutate.
 * @returns A new Chromosome instance with two genes swapped.
 */
export function swapTwoGenes<GeneType>(chromosome: Chromosome<GeneType>) {
  const mutationGenes = [...chromosome.genes]

  const [indexA, indexB] = sampleArray(range(0, chromosome.genes.length), 2)
  mutationGenes[indexA] = chromosome.genes[indexB]
  mutationGenes[indexB] = chromosome.genes[indexA]

  return new Chromosome<GeneType>(mutationGenes)
}
