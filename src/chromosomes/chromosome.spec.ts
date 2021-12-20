import {expect} from 'chai'

import {Chromosome} from './chromosome'

describe('chromosomes > chromosome', () => {
  describe('Chromosome', () => {
    describe('#genes', () => {
      it('is the gene array given at instantiation', () => {
        const genes = [123, 234, 345, 456]
        const chromosome = new Chromosome<number>(genes)
        expect(chromosome.genes).to.equal(genes)
      })
    })

    describe('#getGene()', () => {
      it('returns the gene at the given index', () => {
        const chromosome = new Chromosome<number>([123, 234, 345, 456])
        expect(chromosome.getGene(2)).to.equal(345)
      })

      it('returns undefined when no gene is present at the given index', () => {
        const chromosome = new Chromosome<number>([123, 234])
        expect(chromosome.getGene(2)).to.equal(undefined)
      })
    })

    describe('#getLength()', () => {
      it('returns the count of genes in the chromosome', () => {
        const chromosome = new Chromosome<number>([123, 234, 345, 456])
        expect(chromosome.getLength()).to.equal(4)
      })

      it('returns 0 when the chromosome is empty', () => {
        const chromosome = new Chromosome<number>([])
        expect(chromosome.getLength()).to.equal(0)
      })
    })
  })
})
