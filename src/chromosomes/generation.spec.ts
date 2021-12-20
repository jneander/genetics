import {RandomUint32Fn} from '@jneander/utils-random'
import Chai, {expect} from 'chai'
import ChaiEach from 'chai-each'
import {stub} from 'sinon'

import {Chromosome} from './chromosome'
import {randomChromosome} from './generation'

Chai.use(ChaiEach)

describe('chromosomes > generation', () => {
  describe('.randomChromosome()', () => {
    it('returns an instance of a Chromosome', () => {
      const geneSet = [123, 234, 345, 456]
      const chromosome = randomChromosome(6, geneSet)
      expect(chromosome).to.be.instanceOf(Chromosome)
    })

    it('creates the Chromosome using the given length', () => {
      const geneSet = [123, 234, 345, 456]
      const chromosome = randomChromosome(6, geneSet)
      expect(chromosome.getLength()).to.equal(6)
    })

    it('creates the Chromosome using the given gene set', () => {
      const geneSet = [123, 234, 345, 456]
      const chromosome = randomChromosome(6, geneSet)
      expect(chromosome.genes).to.each.be.oneOf(geneSet)
    })

    it('randomly selects genes from the given gene set', () => {
      const geneSet = [123, 234, 345, 456]
      let callCount = 0

      const randomUint32Fn: RandomUint32Fn = stub().callsFake((_: number, maxExclusive: number) => {
        return callCount++ % maxExclusive
      })

      const chromosome = randomChromosome(6, geneSet, {randomUint32Fn})
      expect(chromosome.genes).to.deep.equal([123, 234, 345, 456, 123, 234])
    })
  })
})
