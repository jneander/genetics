import type Chromosome from '../Chromosome'

export interface Fitness<ValueType> {
  value: ValueType

  isEqualTo(fitness: Fitness<ValueType>): boolean
  isGreaterThan(fitness: Fitness<ValueType>): boolean
  isLessThan(fitness: Fitness<ValueType>): boolean
  toString(): string
  valueOf(): ValueType
}

export interface FitnessCalculator<GeneType, FitnessValueType> {
  getFitness(
    current: Chromosome<GeneType, FitnessValueType>,
    target: Chromosome<GeneType, FitnessValueType>
  ): Fitness<FitnessValueType>

  getTargetFitness(target: Chromosome<GeneType, FitnessValueType>): Fitness<FitnessValueType>
}
