import type {Chromosome} from '../chromosomes'
import {NumberFitness} from './number-fitness'

function computeIsEqualIdentity<GeneType>(geneA: GeneType, geneB: GeneType): boolean {
  return geneA === geneB
}

/**
 * A function which accepts two Genes of the same type, returns `true` when they
 * are considered to be equal, and returns `false` when they are considered to
 * be different.
 */
type ComputeIsEqual<GeneType> = (geneA: GeneType, geneB: GeneType) => boolean

/**
 * Configuration options for the `ArrayMatch` class.
 */
interface ArrayMatchOptions<GeneType> {
  /**
   * A function which accepts two Genes of the same type, returns `true` when
   * they are considered to be equal, and returns `false` when they are
   * considered to be different.  This function defaults to one which uses
   * identity to compare equality.
   */
  computeIsEqual?: ComputeIsEqual<GeneType>
}

/**
 * A class which calculates the Fitness for a Chromosome based on its Genes as
 * compared to those of another Chromosome.
 *
 * The lengths of both Chromosomes are assumed to be identical.
 *
 * @export
 * @class ArrayMatch
 * @template GeneType
 */
export class ArrayMatch<GeneType = any> {
  private computeIsEqual: ComputeIsEqual<GeneType>

  /**
   * Creates an instance of ArrayMatch.
   *
   * @param {ComputeIsEqual<GeneType>} [options.computeIsEqual] A function which
   * accepts two Genes of the same type, returns `true` when they are considered
   * to be equal, and returns `false` when they are considered to be different.
   * This function defaults to one which uses identity to compare equality.
   * @memberof ArrayMatch
   */
  constructor(options?: ArrayMatchOptions<GeneType>) {
    this.computeIsEqual = options?.computeIsEqual || computeIsEqualIdentity
  }

  /**
   * A method which compares one Chromosome against another and returns a
   * numerical Fitness indicating the similarity of their Genes. Fitness
   * improves with the number of Gene array indices sharing the same Gene value
   * between the two Chromosomes.
   *
   * @param {Chromosome<GeneType>} currentChromosome The Chromosome being
   * measured.
   * @param {Chromosome<GeneType>} targetChromosome The Chromosome against which
   * the `currentChromosome` is being measured.
   * @returns {NumberFitness} A Fitness using a non-negative integer of
   * increasing value to convey the Fitness of the given Chromosome.
   */
  getFitness(
    currentChromosome: Chromosome<GeneType>,
    targetChromosome: Chromosome<GeneType>
  ): NumberFitness {
    const geneLength = currentChromosome.getLength()

    let fitness = 0

    for (let i = 0; i < geneLength; i++) {
      const currentGene = currentChromosome.getGene(i)
      const targetGene = targetChromosome.getGene(i)

      fitness =
        currentGene && targetGene && this.computeIsEqual(currentGene, targetGene)
          ? fitness + 1
          : fitness
    }

    return new NumberFitness(fitness)
  }

  /**
   * A method which accepts a Chromosome representing the target against which
   * Fitness will be measured, and returns a numerical Fitness that reflects the
   * number of Genes which need to be matched.
   *
   * @param {Chromosome<GeneType>} targetChromosome A Chromosome representing
   * optimal Fitness for ArrayOrder.
   * @returns {NumberFitness} The optimal Fitness for ArrayMatch.
   */
  getTargetFitness(targetChromosome: Chromosome<GeneType>): NumberFitness {
    return new NumberFitness(targetChromosome.genes.length)
  }
}
