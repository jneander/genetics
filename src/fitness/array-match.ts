import type {Chromosome} from '../chromosomes'
import {NumberFitness} from './number-fitness'

function computeIsEqualIdentity<GeneType>(geneA: GeneType, geneB: GeneType) {
  return geneA === geneB
}

type ComputeIsEqual<GeneType> = (geneA: GeneType, geneB: GeneType) => boolean

interface ArrayMatchOptions<GeneType> {
  computeIsEqual?: ComputeIsEqual<GeneType>
}

export class ArrayMatch<GeneType = any> {
  private computeIsEqual: ComputeIsEqual<GeneType>

  constructor(options?: ArrayMatchOptions<GeneType>) {
    this.computeIsEqual = options?.computeIsEqual || computeIsEqualIdentity
  }

  getFitness(
    currentChromosome: Chromosome<GeneType>,
    targetChromosome: Chromosome<GeneType>
  ): NumberFitness {
    const geneLength = currentChromosome.getLength()

    let fitness = 0

    for (let i = 0; i < geneLength; i++) {
      const currentGene = currentChromosome.getGene(i)
      const targetGene = targetChromosome.getGene(i)

      fitness =
        currentGene && targetGene && this.computeIsEqual(currentGene, targetGene)
          ? fitness + 1
          : fitness
    }

    return new NumberFitness(fitness)
  }

  getTargetFitness(targetChromosome: Chromosome<GeneType>): NumberFitness {
    return new NumberFitness(targetChromosome.genes.length)
  }
}
