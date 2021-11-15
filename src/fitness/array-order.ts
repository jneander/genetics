import {Chromosome} from '../chromosomes'
import {Fitness} from './types'

export type OrderFitnessValue = {
  ordered: number
  gap: number
}

export class OrderFitness implements Fitness<OrderFitnessValue> {
  public value: OrderFitnessValue

  constructor(ordered: number, gap: number) {
    this.value = {ordered, gap}
  }

  isEqualTo(fitness: Fitness<OrderFitnessValue>): boolean {
    return this.value.ordered === fitness.value.ordered && this.value.gap === fitness.value.gap
  }

  isGreaterThan(fitness: Fitness<OrderFitnessValue>): boolean {
    return this.value.ordered !== fitness.value.ordered
      ? this.value.ordered > fitness.value.ordered
      : this.value.gap < fitness.value.gap
  }

  isLessThan(fitness: Fitness<OrderFitnessValue>): boolean {
    return this.value.ordered !== fitness.value.ordered
      ? this.value.ordered < fitness.value.ordered
      : this.value.gap > fitness.value.gap
  }

  toString(): string {
    return `${this.value.ordered},${-this.value.gap}`
  }

  valueOf(): OrderFitnessValue {
    return this.value
  }
}

export class ArrayOrder {
  getFitness(current: Chromosome<number, OrderFitnessValue>): OrderFitness {
    let fitness = 1
    let gap = 0

    for (let i = 1; i < current.genes.length; i++) {
      const [currentGene, previousGene] = [current.getGene(i), current.getGene(i - 1)]
      if (currentGene > previousGene) {
        fitness++
      } else {
        gap += previousGene - currentGene
      }
    }

    return new OrderFitness(fitness, gap)
  }

  getTargetFitness(target: Chromosome<number | string, OrderFitnessValue>): OrderFitness {
    return new OrderFitness(target.genes.length, 0)
  }
}
