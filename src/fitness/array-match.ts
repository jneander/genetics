import {Chromosome} from '../chromosomes'
import {NumberFitness} from './number'
import {FitnessCalculator} from './types'

export class ArrayMatch<GeneType> implements FitnessCalculator<GeneType, number> {
  getFitness(
    current: Chromosome<GeneType, number>,
    target: Chromosome<GeneType, number>
  ): NumberFitness {
    const geneLength = current.getLength()
    let fitness = 0

    for (let i = 0; i < geneLength; i++) {
      fitness = current.getGene(i) === target.getGene(i) ? fitness + 1 : fitness
    }

    return new NumberFitness(fitness)
  }

  getTargetFitness(target: Chromosome<GeneType, number>): NumberFitness {
    return new NumberFitness(target.genes.length)
  }
}
