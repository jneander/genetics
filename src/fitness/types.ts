export interface Fitness<ValueType> {
  value: ValueType

  isEqualTo(fitness: Fitness<ValueType>): boolean
  isGreaterThan(fitness: Fitness<ValueType>): boolean
  isLessThan(fitness: Fitness<ValueType>): boolean
  toString(): string
  valueOf(): ValueType
}
