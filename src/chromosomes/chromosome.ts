export class Chromosome<GeneType = any> {
  public readonly genes: GeneType[]

  constructor(genes: GeneType[]) {
    this.genes = genes
  }

  /**
   * Returns the gene at the given index within the Chromosome.
   *
   * @param {number} index The array position of the gene.
   * @returns {GeneType} The gene at the given index within the Chromosome.
   */
  getGene(index: number): GeneType | undefined {
    return this.genes[index]
  }

  /**
   * Returns the count of genes within the Chromosome.
   *
   * @returns {number} The numerical length of the Chromosome.
   */
  getLength(): number {
    return this.genes.length
  }
}
