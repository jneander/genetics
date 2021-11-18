import type {Chromosome} from '../chromosomes'
import type {Fitness} from '../fitness'

export type PropagationRecord<GeneType, FitnessValueType> = {
  chromosome: Chromosome<GeneType>
  fitness: Fitness<FitnessValueType>
  iteration: number
}
