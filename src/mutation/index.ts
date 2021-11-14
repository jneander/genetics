import {Chromosome} from '../chromosomes'
import {Fitness} from '../fitness'
import {randomInt, range, sampleArray} from '../util'

export function replaceOneGene<GeneType, FitnessValueType>(
  parent: Chromosome<GeneType, FitnessValueType>,
  geneSet: GeneType[],
  getFitness: (chromosome: Chromosome<GeneType, FitnessValueType>) => Fitness<FitnessValueType>,
  iteration: number
) {
  const index = randomInt(0, parent.genes.length)
  const childGenes = [...parent.genes]
  const [newGene, alternate] = sampleArray(geneSet, 2)

  if (childGenes[index] === newGene) {
    childGenes[index] = alternate
  } else {
    childGenes[index] = newGene
  }

  const chromosome = new Chromosome<GeneType, FitnessValueType>(childGenes, iteration)
  chromosome.fitness = getFitness(chromosome)
  return chromosome
}

export function swapTwoGenes<GeneType, FitnessValueType>(
  parent: Chromosome<GeneType, FitnessValueType>,
  geneSet: GeneType[],
  getFitness: (chromosome: Chromosome<GeneType, FitnessValueType>) => Fitness<FitnessValueType>,
  iteration: number,
  times = 1
) {
  const childGenes = [...parent.genes]

  let mutations = times
  while (mutations > 0) {
    mutations--
    const [indexA, indexB] = sampleArray(range(0, parent.genes.length), 2)
    childGenes[indexA] = parent.genes[indexB]
    childGenes[indexB] = parent.genes[indexA]
  }

  const chromosome = new Chromosome<GeneType, FitnessValueType>(childGenes, iteration)
  chromosome.fitness = getFitness(chromosome)
  return chromosome
}
