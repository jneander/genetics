/**
 * A class which holds a sequence of Genes.
 *
 * @export
 * @class Chromosome
 * @template GeneType
 */
export class Chromosome<GeneType = any> {
  /**
   * An array holding a sequence of Genes.
   *
   * @type {GeneType[]}
   */
  public readonly genes: GeneType[]

  /**
   * Creates an instance of Chromosome.
   *
   * @param {GeneType[]} genes An array of Genes.
   */
  constructor(genes: GeneType[]) {
    this.genes = genes
  }

  /**
   * Returns the Gene at the given index within the Chromosome.
   *
   * @param {number} index The array position of the Gene.
   * @returns {GeneType} The Gene at the given index within the Chromosome.
   */
  getGene(index: number): GeneType | undefined {
    return this.genes[index]
  }

  /**
   * Returns the count of Genes within the Chromosome.
   *
   * @returns {number} The numerical length of the Chromosome.
   */
  getLength(): number {
    return this.genes.length
  }
}
