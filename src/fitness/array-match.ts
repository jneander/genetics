import {Chromosome} from '../chromosomes'
import {Fitness, FitnessCalculator} from './types'

export class ArrayMatchFitness implements Fitness<number> {
  public value: number

  protected maximize: boolean

  constructor(value: number, maximize = true) {
    this.value = value
    this.maximize = maximize
  }

  isEqualTo(fitness: Fitness<number>): boolean {
    return this.value == fitness.value
  }

  isGreaterThan(fitness: Fitness<number>): boolean {
    return this.maximize ? this.value > fitness.value : this.value < fitness.value
  }

  isLessThan(fitness: Fitness<number>): boolean {
    return this.maximize ? this.value < fitness.value : this.value > fitness.value
  }

  toString(): string {
    return String(this.value)
  }

  valueOf(): number {
    return this.value
  }
}

export class ArrayMatch<GeneType> implements FitnessCalculator<GeneType, number> {
  getFitness(
    current: Chromosome<GeneType, number>,
    target: Chromosome<GeneType, number>
  ): ArrayMatchFitness {
    const geneLength = current.getLength()
    let fitness = 0

    for (let i = 0; i < geneLength; i++) {
      fitness = current.getGene(i) === target.getGene(i) ? fitness + 1 : fitness
    }

    return new ArrayMatchFitness(fitness)
  }

  getTargetFitness(target: Chromosome<GeneType, number>): ArrayMatchFitness {
    return new ArrayMatchFitness(target.genes.length)
  }
}
