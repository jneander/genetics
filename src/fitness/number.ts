import {Fitness} from './types'

export class NumberFitness implements Fitness<number> {
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
