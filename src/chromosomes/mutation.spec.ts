import {expect} from 'chai'

import {Chromosome} from './chromosome'
import {replaceOneGene, swapTwoGenes} from './mutation'

describe('chromosomes > mutation', () => {
  describe('.replaceOneGene()', () => {
    it('returns a new Chromosome', () => {
      const geneSet = [123, 234, 345, 456]
      const chromosome = new Chromosome<number>([123, 345, 456])
      const nextChromosome: Chromosome = replaceOneGene(chromosome, geneSet)
      expect(nextChromosome).to.not.equal(chromosome)
    })

    it('creates the Chromosome using the length of the given Chromosome', () => {
      const geneSet = [123, 234, 345, 456]
      const chromosome = new Chromosome<number>([123, 345, 456])
      const nextChromosome: Chromosome = replaceOneGene(chromosome, geneSet)
      expect(nextChromosome.getLength()).to.equal(chromosome.getLength())
    })

    it('replaces one gene in the new Chromosome', () => {
      const geneSet = [123, 234, 345, 456]
      const chromosome = new Chromosome<number>([123, 345, 456])
      const nextChromosome: Chromosome = replaceOneGene(chromosome, geneSet)
      const differentGeneCount = nextChromosome.genes.reduce(
        (sum, gene, index) => sum + (gene !== chromosome.getGene(index) ? 1 : 0),
        0
      )
      expect(differentGeneCount).to.equal(1)
    })

    it('replaces the gene with one from the given gene set', () => {
      const geneSet = [234, 567]
      const chromosome = new Chromosome<number>([123, 345, 456])
      const nextChromosome: Chromosome = replaceOneGene(chromosome, geneSet)
      const changedGene = nextChromosome.genes.find(
        (gene, index) => gene !== chromosome.getGene(index)
      )
      expect(changedGene).to.be.oneOf(geneSet)
    })
  })

  describe('.swapTwoGenes()', () => {
    it('returns a new Chromosome', () => {
      const chromosome = new Chromosome<number>([123, 234, 345, 456])
      const nextChromosome: Chromosome = swapTwoGenes(chromosome)
      expect(nextChromosome).to.not.equal(chromosome)
    })

    it('creates the Chromosome using the length of the given Chromosome', () => {
      const chromosome = new Chromosome<number>([123, 234, 345, 456])
      const nextChromosome: Chromosome = swapTwoGenes(chromosome)
      expect(nextChromosome.getLength()).to.equal(chromosome.getLength())
    })

    it('changes two genes in the new Chromosome', () => {
      const chromosome = new Chromosome<number>([123, 234, 345, 456])
      const nextChromosome: Chromosome = swapTwoGenes(chromosome)
      const differentGeneCount = nextChromosome.genes.reduce(
        (sum, gene, index) => sum + (gene !== chromosome.getGene(index) ? 1 : 0),
        0
      )
      expect(differentGeneCount).to.equal(2)
    })

    it('swaps the two changed genes with each other', () => {
      const chromosome = new Chromosome<number>([123, 234, 345, 456])
      const nextChromosome: Chromosome = swapTwoGenes(chromosome)
      const geneEntries = Array.from(nextChromosome.genes.entries())
      const changedGeneEntries = geneEntries.filter(
        ([index, gene]) => gene !== chromosome.getGene(index)
      )
      expect(chromosome.getGene(changedGeneEntries[0][0])).to.equal(changedGeneEntries[1][1])
      expect(chromosome.getGene(changedGeneEntries[1][0])).to.equal(changedGeneEntries[0][1])
    })
  })
})
