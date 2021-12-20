/**
 * An interface for Fitness classes.
 *
 * @export
 * @interface Fitness
 * @template ValueType The data structure representing a measured Fitness value.
 */
export interface Fitness<ValueType> {
  /**
   * The numerical Fitness value.
   *
   * @type {number}
   * @memberof Fitness
   */
  readonly value: ValueType

  /**
   * A method which determines if this Fitness is equal to the given Fitness.
   *
   * @param {Fitness<ValueType>} fitness A Fitness to compare this Fitness
   * against.
   * @returns {boolean} `true` when both considered to be equal; `false`
   * otherwise
   */
  isEqualTo(fitness: Fitness<ValueType>): boolean

  /**
   * A method which determines if this Fitness is greater than the given
   * Fitness.
   *
   * @param {Fitness<ValueType>} fitness A Fitness to compare this Fitness
   * against.
   * @returns {boolean} `true` when this Fitness is considered to be greater in
   * value than the given Fitness; `false` otherwise.
   */
  isGreaterThan(fitness: Fitness<ValueType>): boolean

  /**
   * A method which determines if this Fitness is lesser than the given Fitness.
   *
   * @param {Fitness<ValueType>} fitness A Fitness to compare this Fitness
   * against.
   * @returns {boolean} `true` when this Fitness is considered to be lesser in
   * value than the given Fitness; `false` otherwise.
   */
  isLessThan(fitness: Fitness<ValueType>): boolean
}
