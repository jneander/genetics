import type {Chromosome} from '../chromosomes'
import type {Fitness} from '../fitness'
import type {PropagationRecord} from './types'

export type {PropagationRecord}

export type PropagationConfig<GeneType, FitnessValueType> = {
  optimalFitness: Fitness<FitnessValueType>

  calculateFitness(chromosome: Chromosome<GeneType>): Fitness<FitnessValueType>
  generateParent(): Chromosome<GeneType>
  mutate(chromosome: Chromosome<GeneType>): Chromosome<GeneType>
  onImprovement(record: PropagationRecord<GeneType, FitnessValueType>): void
  onIteration(record: PropagationRecord<GeneType, FitnessValueType>): void
}

export class Propagation<GeneType, FitnessValueType> {
  private config: PropagationConfig<GeneType, FitnessValueType>

  private iterationCount: number
  private bestRecord: PropagationRecord<GeneType, FitnessValueType> | null
  private currentRecord: PropagationRecord<GeneType, FitnessValueType> | null

  constructor(config: PropagationConfig<GeneType, FitnessValueType>) {
    this.config = config

    this.iterationCount = 0
    this.bestRecord = null
    this.currentRecord = null
  }

  get iteration() {
    return this.iterationCount
  }

  get best(): PropagationRecord<GeneType, FitnessValueType> | null {
    return this.bestRecord
  }

  get current(): PropagationRecord<GeneType, FitnessValueType> | null {
    return this.currentRecord
  }

  get hasReachedOptimalFitness(): boolean {
    return this.best != null && !this.best.fitness.isLessThan(this.config.optimalFitness)
  }

  iterate(): boolean {
    if (this.hasReachedOptimalFitness) {
      return false
    }

    if (this.bestRecord == null) {
      this.iterationCount = 1

      const chromosome = this.config.generateParent()
      const fitness = this.config.calculateFitness(chromosome)

      this.currentRecord = {
        chromosome,
        fitness,
        iteration: this.iterationCount
      }

      this.config.onIteration(this.currentRecord)

      this.bestRecord = this.currentRecord
      this.config.onImprovement(this.bestRecord)

      return true
    }

    this.iterationCount++
    const nextChromosome = this.config.mutate(this.bestRecord.chromosome)
    const childFitness = this.config.calculateFitness(nextChromosome)

    this.currentRecord = {
      chromosome: nextChromosome,
      fitness: childFitness,
      iteration: this.iterationCount
    }

    this.config.onIteration(this.currentRecord)

    if (this.bestRecord.fitness.isGreaterThan(this.currentRecord.fitness)) {
      // This mutation is worse than the best ancestor. Reject it.
      return true
    }

    if (!this.currentRecord.fitness.isGreaterThan(this.bestRecord.fitness)) {
      /*
       * This mutation is not better than the best ancestor, but could still
       * help progress. Assign it as the best record for that reason, but do not
       * report it as an improvement.
       */
      this.bestRecord = this.currentRecord
      return true
    }

    this.bestRecord = this.currentRecord
    this.config.onImprovement(this.bestRecord)

    return true
  }
}
