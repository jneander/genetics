import {Fitness} from './fitness'

export class Chromosome<GeneType, FitnessValueType> {
  public fitness: Fitness<FitnessValueType> | null
  public readonly genes: GeneType[]
  public readonly iteration: number

  constructor(genes: GeneType[], iteration: number) {
    this.genes = genes
    this.fitness = null
    this.iteration = iteration
  }

  getGene(index: number): GeneType {
    return this.genes[index]
  }

  getLength(): number {
    return this.genes.length
  }

  toString(): string {
    return this.genes.join('')
  }

  toArray(): GeneType[] {
    return this.genes
  }
}
