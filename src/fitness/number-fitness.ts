import type {Fitness} from './types'

/**
 * A class which holds a value for numerical Fitness calculations.
 *
 * @export
 * @class NumberFitness
 * @implements {Fitness<number>}
 */
export class NumberFitness implements Fitness<number> {
  public readonly value: number

  /**
   * A boolean which indicates whether the Fitness value is greater when
   * numerically higher or not. Defaults to `true`.
   *
   * @protected
   * @type {boolean}
   * @memberof NumberFitness
   */
  protected higherIsGreater: boolean

  /**
   * Creates an instance of NumberFitness.
   *
   * @param {number} value The numerical Fitness value.
   * @param {boolean} [higherIsGreater=true] A boolean which indicates whether
   * the Fitness value is greater when numerically higher or lower. Defaults to
   * `true`. When `false`, comparison methods for fitness inequality will be
   * inverted.
   */
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
