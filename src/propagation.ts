import {BoundedLoop} from '@jneander/utils-async'

import {Chromosome, Fitness} from '.'

export type PropagationConfig<GeneType, FitnessValueType> = {
  optimalFitness: Fitness<FitnessValueType>

  generateParent(): Chromosome<GeneType, FitnessValueType>
  mutate(
    chromosome: Chromosome<GeneType, FitnessValueType>,
    iteration: number
  ): Chromosome<GeneType, FitnessValueType>
  onFinish(): void
  onImprovement(chromosome: Chromosome<GeneType, FitnessValueType>): void
  onIteration(chromosome: Chromosome<GeneType, FitnessValueType>): void
  onRun(): void
}

export class Propagation<GeneType, FitnessValueType> {
  public iterationCount: number

  private bestParent: Chromosome<GeneType, FitnessValueType> | null
  private config: PropagationConfig<GeneType, FitnessValueType>
  private currentGuess: Chromosome<GeneType, FitnessValueType> | null
  private loop: BoundedLoop | null

  constructor(config: PropagationConfig<GeneType, FitnessValueType>) {
    this.config = config

    this.iterationCount = 0
    this.loop = null

    this.bestParent = null
    this.currentGuess = null
  }

  best() {
    return this.bestParent
  }

  current() {
    return this.currentGuess
  }

  run() {
    if (this.loop != null) {
      return
    }

    this.config.onRun()

    if (!this.iterationCount) {
      this.iterationCount++
      this.bestParent = this.config.generateParent()
      this.config.onIteration(this.bestParent)

      this.config.onImprovement(this.bestParent)
      this.currentGuess = this.bestParent

      if (!this.bestParent.fitness!.isLessThan(this.config.optimalFitness)) {
        this.config.onFinish()
        return
      }
    }

    this.loop = new BoundedLoop({loopFn: this.iterate.bind(this)})
    this.loop.start()
  }

  stop() {
    if (this.loop != null) {
      this.loop.stop()
      this.loop = null
    }
  }

  private iterate() {
    this.iterationCount++
    const child = this.config.mutate(this.bestParent!, this.iterationCount)
    this.config.onIteration(child)

    this.currentGuess = child
    if (this.bestParent!.fitness!.isGreaterThan(child.fitness!)) {
      // this child is worse than the previous iteration; skip it
      return
    }

    if (!child.fitness!.isGreaterThan(this.bestParent!.fitness!)) {
      // this child is not "better" than the parent
      // use it anyway, in case it helps progress
      this.bestParent = child
      return
    }

    this.bestParent = child
    this.config.onImprovement(this.bestParent)

    if (!child.fitness!.isLessThan(this.config.optimalFitness)) {
      this.stop()
      this.config.onFinish()
    }
  }
}
