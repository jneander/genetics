import {BoundedLoop} from '@jneander/utils-async'

import {Chromosome} from '../chromosomes'
import {Fitness} from '../fitness'
import type {PropagationRecord} from './types'

export type {PropagationRecord}

export type PropagationConfig<GeneType, FitnessValueType> = {
  optimalFitness: Fitness<FitnessValueType>

  calculateFitness(chromosome: Chromosome<GeneType>): Fitness<FitnessValueType>
  generateParent(): Chromosome<GeneType>
  mutate(chromosome: Chromosome<GeneType>): Chromosome<GeneType>
  onFinish(): void
  onImprovement(record: PropagationRecord<GeneType, FitnessValueType>): void
  onIteration(record: PropagationRecord<GeneType, FitnessValueType>): void
  onRun(): void
}

export class Propagation<GeneType, FitnessValueType> {
  private config: PropagationConfig<GeneType, FitnessValueType>

  private iterationCount: number
  private bestRecord: PropagationRecord<GeneType, FitnessValueType> | null
  private currentRecord: PropagationRecord<GeneType, FitnessValueType> | null

  private loop: BoundedLoop | null

  constructor(config: PropagationConfig<GeneType, FitnessValueType>) {
    this.config = config

    this.iterationCount = 0
    this.bestRecord = null
    this.currentRecord = null

    this.loop = null
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

  run(): void {
    if (this.loop != null) {
      return
    }

    this.config.onRun()

    if (!this.iterationCount) {
      this.iterationCount++
      this.bestRecord = this.generateParentRecord()

      this.config.onIteration(this.bestRecord)
      this.config.onImprovement(this.bestRecord)

      this.currentRecord = this.bestRecord

      if (!this.bestRecord.fitness!.isLessThan(this.config.optimalFitness)) {
        this.config.onFinish()
        return
      }
    }

    this.loop = new BoundedLoop({loopFn: this.iterate.bind(this)})
    this.loop.start()
  }

  stop(): void {
    if (this.loop != null) {
      this.loop.stop()
      this.loop = null
    }
  }

  private generateParentRecord(): PropagationRecord<GeneType, FitnessValueType> {
    const chromosome = this.config.generateParent()
    const fitness = this.config.calculateFitness(chromosome)

    return {
      chromosome,
      fitness,
      iteration: 1
    }
  }

  private iterate(): void {
    if (!this.bestRecord) {
      // This is a safety check against calling .iterate() incorrectly. This
      // situation should never occur.
      return
    }

    this.iterationCount++
    const nextChromosome = this.config.mutate(this.bestRecord.chromosome)
    const childFitness = this.config.calculateFitness(nextChromosome)

    const childRecord: PropagationRecord<GeneType, FitnessValueType> = {
      chromosome: nextChromosome,
      fitness: childFitness,
      iteration: this.iterationCount
    }

    this.config.onIteration(childRecord)

    this.currentRecord = childRecord
    if (this.bestRecord.fitness.isGreaterThan(childRecord.fitness)) {
      // This mutation is worse than the best ancestor. Reject it.
      return
    }

    if (!childRecord.fitness.isGreaterThan(this.bestRecord.fitness)) {
      /*
       * This mutation is not better than the best ancestor, but could still
       * help progress. Assign it as the best record for that reason, but do not
       * report it as an improvement.
       */
      this.bestRecord = childRecord
      return
    }

    this.bestRecord = childRecord
    this.config.onImprovement(this.bestRecord)

    if (!childRecord.fitness.isLessThan(this.config.optimalFitness)) {
      this.stop()
      this.config.onFinish()
    }
  }
}
