import type {Fitness} from './types'

export class NumberFitness implements Fitness<number> {
  public readonly value: number

  protected higherIsGreater: boolean

  constructor(value: number, higherIsGreater = true) {
    this.value = value
    this.higherIsGreater = higherIsGreater
  }

  isEqualTo(fitness: Fitness<number>): boolean {
    return this.value == fitness.value
  }

  isGreaterThan(fitness: Fitness<number>): boolean {
    return this.higherIsGreater ? this.value > fitness.value : this.value < fitness.value
  }

  isLessThan(fitness: Fitness<number>): boolean {
    return this.higherIsGreater ? this.value < fitness.value : this.value > fitness.value
  }
}
