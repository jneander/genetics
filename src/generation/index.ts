import {Chromosome} from '../chromosomes'
import {Fitness} from '../fitness'
import {sampleArray} from '../util'

export {default as TextArray} from './TextArray'

export function generateParent<GeneType, FitnessValueType>(
  length: number,
  geneSet: GeneType[],
  getFitness: (chromosome: Chromosome<GeneType, FitnessValueType>) => Fitness<FitnessValueType>
) {
  let genes: GeneType[] = []

  while (genes.length < length) {
    const sampleSize = Math.min(length - genes.length, geneSet.length)
    genes = genes.concat(sampleArray(geneSet, sampleSize))
  }

  const chromosome = new Chromosome<GeneType, FitnessValueType>(genes, 1)
  chromosome.fitness = getFitness(chromosome)

  return chromosome
}
