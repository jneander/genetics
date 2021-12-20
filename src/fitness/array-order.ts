import type {Chromosome} from '../chromosomes'
import type {Fitness} from './types'

export type ArrayOrderFitnessValue = {
  ordered: number
  gap: number
}

export class ArrayOrderFitness implements Fitness<ArrayOrderFitnessValue> {
  public readonly value: ArrayOrderFitnessValue

  constructor(ordered: number, gap: number) {
    this.value = {ordered, gap}
  }

  isEqualTo(fitness: Fitness<ArrayOrderFitnessValue>): boolean {
    return this.value.ordered === fitness.value.ordered && this.value.gap === fitness.value.gap
  }

  isGreaterThan(fitness: Fitness<ArrayOrderFitnessValue>): boolean {
    return this.value.ordered !== fitness.value.ordered
      ? this.value.ordered > fitness.value.ordered
      : this.value.gap < fitness.value.gap
  }

  isLessThan(fitness: Fitness<ArrayOrderFitnessValue>): boolean {
    return this.value.ordered !== fitness.value.ordered
      ? this.value.ordered < fitness.value.ordered
      : this.value.gap > fitness.value.gap
  }
}

function computeIsOrderedAscending(previousGene: any, nextGene: any): boolean {
  return nextGene >= previousGene
}

function getStringOrNumberValue(value: any): number {
  return Number.isFinite(value) ? +value : String(value).charCodeAt(0)
}

function computeStringOrNumberGap(previousGene: any, nextGene: any): number {
  return Math.abs(getStringOrNumberValue(nextGene) - getStringOrNumberValue(previousGene))
}

type ComputeIsOrdered<GeneType> = (previousGene: GeneType, nextGene: GeneType) => boolean
type ComputeGap<GeneType> = (previousGene: GeneType, nextGene: GeneType) => number

interface ArrayOrderOptions<GeneType> {
  computeGap?: ComputeGap<GeneType>
  computeIsOrdered?: ComputeIsOrdered<GeneType>
}

export class ArrayOrder<GeneType = number | string> {
  private computeGap: ComputeGap<GeneType>
  private computeIsOrdered: ComputeIsOrdered<GeneType>

  constructor(options?: ArrayOrderOptions<GeneType>) {
    this.computeGap = options?.computeGap || computeStringOrNumberGap
    this.computeIsOrdered = options?.computeIsOrdered || computeIsOrderedAscending
  }

  getFitness(chromosome: Chromosome<GeneType>): ArrayOrderFitness {
    let ordered = 1
    let gap = 0

    for (let i = 1; i < chromosome.genes.length; i++) {
      const [previousGene, nextGene] = [chromosome.getGene(i - 1)!, chromosome.getGene(i)!]
      if (this.computeIsOrdered(previousGene, nextGene)) {
        ordered++
      } else {
        gap += this.computeGap(previousGene, nextGene)
      }
    }

    return new ArrayOrderFitness(ordered, gap)
  }

  getTargetFitness(target: Chromosome<GeneType>): ArrayOrderFitness {
    return new ArrayOrderFitness(target.genes.length, 0)
  }
}
