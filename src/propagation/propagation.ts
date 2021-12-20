import type {Chromosome} from '../chromosomes'
import type {Fitness} from '../fitness'
import type {PropagationRecord} from './types'

/**
 * Configuration options for the `Propagation` class.
 */
export type PropagationConfig<GeneType, FitnessValueType> = {
  /**
   * An optional target Fitness. When provided, this Fitness will be considered
   * with each iteration.
   */
  optimalFitness?: Fitness<FitnessValueType>

  /**
   * A function which calculates and returns the Fitness of the given
   * Chromosome.
   *
   * @param chromosome A Chromosome of the same GeneType as the Propagation.
   */
  calculateFitness(chromosome: Chromosome<GeneType>): Fitness<FitnessValueType>

  /**
   * A function which generates and returns a Chromosome of the same GeneType as
   * the Propagation. This function is called in the initial iteration of the
   * Propagation. The resulting Chromosome is used as both the "current" and
   * "best" PropogationRecords for that iteration.
   */
  generateParent(): Chromosome<GeneType>

  /**
   * A function which receives the Chromosome of the "best" PropagationRecord
   * and returns a Chromosome derived from it.
   *
   * @param chromosome
   */
  mutate(chromosome: Chromosome<GeneType>): Chromosome<GeneType>

  /**
   * An optional callback function which is called with the "best"
   * PropagationRecord. The callback is called whenever that record changes,
   * including when it is first established.
   *
   * @param record The "best" PropagationRecord.
   */
  onImprovement?(record: PropagationRecord<GeneType, FitnessValueType>): void

  /**
   * An optional callback function which is called with the "current"
   * PropagationRecord. The callback is called with each iteration.
   *
   * @param record The "current" PropagationRecord.
   */
  onIteration?(record: PropagationRecord<GeneType, FitnessValueType>): void
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

  /**
   * The count of iterations this Propagation has completed.
   *
   * @readonly
   * @type {number}
   * @memberof Propagation
   */
  get iteration(): number {
    return this.iterationCount
  }

  /**
   * The record referencing the Chromosome having the greatest Fitness from
   * among the completed iterations.
   *
   * @readonly
   * @type {(PropagationRecord<GeneType, FitnessValueType> | null)}
   * @memberof Propagation
   */
  get best(): PropagationRecord<GeneType, FitnessValueType> | null {
    return this.bestRecord
  }

  /**
   * The record referencing the Chromosome most recently generated or derived
   * via mutation through iteration.
   *
   * @readonly
   * @type {(PropagationRecord<GeneType, FitnessValueType> | null)}
   * @memberof Propagation
   */
  get current(): PropagationRecord<GeneType, FitnessValueType> | null {
    return this.currentRecord
  }

  /**
   * When this Propagation is configured with an `optimalFitness`, this field
   * will be `true` when the Fitness of the "best" record's Chromosome is equal
   * to or greater than the `optimalFitness`. Otherwise, this field will be
   * `false`.
   *
   * @readonly
   * @type {boolean}
   * @memberof Propagation
   */
  get hasReachedOptimalFitness(): boolean {
    return (
      !!this.config.optimalFitness &&
      this.best != null &&
      !this.best.fitness.isLessThan(this.config.optimalFitness)
    )
  }

  /**
   * Advance the Propagation.
   *
   * When first called, this will generate the initial Chromosome using the
   * configured `generateParent` function, then calculate its Fitness. This
   * establishes the initial "best" PropagationRecord.
   *
   * On subsequent calls, the configured `mutate` function will be called with
   * the "best" PropagationRecord. The resulting Chromosome's Fitness will be
   * calculated, and a PropagationRecord with both will be recorded as the
   * "current" record.
   *
   * The "current" and "best" records will then be compared. When the "current"
   * record is considered at least as good as the "best" record, it will replace
   * the "best" record.
   *
   * When the Propagation is configured with an `optimalFitness`, this method
   * will exit immediately when the Fitness of the "best" record's Chromosome is
   * equal to or greater than the `optimalFitness`.
   *
   * @returns `false` when the Fitness of the "best" record's Chromosome is
   * equal to or greater than the configured `optimalFitness`. `true` otherwise.
   */
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

      this.config.onIteration?.(this.currentRecord)

      this.bestRecord = this.currentRecord
      this.config.onImprovement?.(this.bestRecord)

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

    this.config.onIteration?.(this.currentRecord)

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
    this.config.onImprovement?.(this.bestRecord)

    return true
  }
}
