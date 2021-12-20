import type {Chromosome} from '../chromosomes'
import type {Fitness} from './types'

/**
 * The fitness value type used with `ArrayOrderFitness`.
 */
export type ArrayOrderFitnessValue = {
  /**
   * The count of numbers which are in the correct order after their
   * predecessor. Higher is more fit.
   */
  ordered: number

  /**
   * The sum of the difference between adjacent numbers that are incorrectly
   * ordered. Lower is more fit. Zero is optimal.
   */
  gap: number
}

/**
 * A class which holds a value used for `ArrayOrder` Fitness calculations.
 *
 * @export
 * @implements {Fitness<ArrayOrderFitnessValue>}
 */
export class ArrayOrderFitness implements Fitness<ArrayOrderFitnessValue> {
  public readonly value: ArrayOrderFitnessValue

  /**
   * Creates an instance of ArrayOrderFitness.
   *
   * @param {number} ordered The count of numbers which are in the correct order
   * after their predecessor. Higher is more fit.
   * @param {number} gap The sum of the difference between adjacent numbers that
   * are incorrectly ordered. Lower is more fit. Zero is optimal.
   */
  constructor(ordered: number, gap: number) {
    this.value = {ordered, gap}
  }

  isEqualTo(fitness: Fitness<ArrayOrderFitnessValue>): boolean {
    return this.value.ordered === fitness.value.ordered && this.value.gap === fitness.value.gap
  }

  isGreaterThan(fitness: Fitness<ArrayOrderFitnessValue>): boolean {
    return this.value.ordered !== fitness.value.ordered
      ? this.value.ordered > fitness.value.ordered
      : this.value.gap < fitness.value.gap
  }

  isLessThan(fitness: Fitness<ArrayOrderFitnessValue>): boolean {
    return this.value.ordered !== fitness.value.ordered
      ? this.value.ordered < fitness.value.ordered
      : this.value.gap > fitness.value.gap
  }
}

function computeIsOrderedAscending(previousGene: any, nextGene: any): boolean {
  return nextGene >= previousGene
}

function getStringOrNumberValue(value: any): number {
  return Number.isFinite(value) ? +value : String(value).charCodeAt(0)
}

function computeStringOrNumberGap(previousGene: any, nextGene: any): number {
  return Math.abs(getStringOrNumberValue(nextGene) - getStringOrNumberValue(previousGene))
}

type ComputeIsOrdered<GeneType> = (previousGene: GeneType, nextGene: GeneType) => boolean
type ComputeGap<GeneType> = (previousGene: GeneType, nextGene: GeneType) => number

interface ArrayOrderOptions<GeneType> {
  computeGap?: ComputeGap<GeneType>
  computeIsOrdered?: ComputeIsOrdered<GeneType>
}

/**
 * A class which calculates the Fitness for a Chromosome based on the order of
 * its Genes and the differences in value between adjacent Genes.
 *
 * @export
 * @class ArrayOrder
 * @template GeneType
 */
export class ArrayOrder<GeneType = number | string> {
  private computeGap: ComputeGap<GeneType>
  private computeIsOrdered: ComputeIsOrdered<GeneType>

  /**
   * Creates an instance of ArrayOrder.
   *
   * @param {ComputeGap<GeneType>} [options.computeGap] An optional function
   * which accepts two Genes and returns the numerical difference between their
   * values.
   * @param {ComputeIsOrdered<GeneType>} [options.computeIsOrdered] An optional
   * function which accepts two Genes, returns `true` when they are considered
   * to be ordered, and returns `false` otherwise.
   */
  constructor(options?: ArrayOrderOptions<GeneType>) {
    this.computeGap = options?.computeGap || computeStringOrNumberGap
    this.computeIsOrdered = options?.computeIsOrdered || computeIsOrderedAscending
  }

  /**
   * A method which returns the Fitness calculated for the given Chromosome.
   *
   * @param {Chromosome<GeneType>} chromosome The Chromosome being measured.
   * @returns {ArrayOrderFitness} The Fitness of the given Chromosome.
   */
  getFitness(chromosome: Chromosome<GeneType>): ArrayOrderFitness {
    let ordered = 1
    let gap = 0

    for (let i = 1; i < chromosome.genes.length; i++) {
      const [previousGene, nextGene] = [chromosome.getGene(i - 1)!, chromosome.getGene(i)!]
      if (this.computeIsOrdered(previousGene, nextGene)) {
        ordered++
      } else {
        gap += this.computeGap(previousGene, nextGene)
      }
    }

    return new ArrayOrderFitness(ordered, gap)
  }

  /**
   * A method which accepts a Chromosome representing the target against which
   * Fitness will be measured, and returns a numerical Fitness that reflects
   * both the number of Genes which need to be ordered and the value of the
   * cumulative gap between them.
   *
   * @param {Chromosome<GeneType>} targetChromosome A Chromosome representing
   * optimal Fitness for ArrayOrder.
   * @returns {ArrayOrderFitness} The optimal Fitness for ArrayOrder.
   */
  getTargetFitness(targetChromosome: Chromosome<GeneType>): ArrayOrderFitness {
    return new ArrayOrderFitness(targetChromosome.genes.length, 0)
  }
}
