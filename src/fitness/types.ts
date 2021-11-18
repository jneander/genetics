export interface Fitness<ValueType> {
  readonly value: ValueType

  isEqualTo(fitness: Fitness<ValueType>): boolean
  isGreaterThan(fitness: Fitness<ValueType>): boolean
  isLessThan(fitness: Fitness<ValueType>): boolean
}
