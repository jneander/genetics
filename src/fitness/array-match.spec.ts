import {expect} from 'chai'

import {Chromosome} from '../chromosomes'
import {ArrayMatch} from './array-match'

describe('fitness > array match', () => {
  describe('ArrayMatch', () => {
    const identityArrayMatch = new ArrayMatch()

    describe('#getFitness()', () => {
      it('sets the fitness to the count of array entries matching between the given chromosomes', () => {
        const chromosomeA = new Chromosome<number>([1, 2, 3, 4, 5])
        const chromosomeB = new Chromosome<number>([1, 4, 2, 3, 5])
        const fitness = identityArrayMatch.getFitness(chromosomeA, chromosomeB)
        expect(fitness.value).to.equal(2)
      })

      it('sets the fitness to the array length when all entries match', () => {
        const chromosomeA = new Chromosome<number>([1, 4, 2, 3, 5])
        const chromosomeB = new Chromosome<number>([1, 4, 2, 3, 5])
        const fitness = identityArrayMatch.getFitness(chromosomeA, chromosomeB)
        expect(fitness.value).to.equal(5)
      })

      it('sets the fitness to 0 when no entries match', () => {
        const chromosomeA = new Chromosome<number>([1, 2, 3, 4, 5])
        const chromosomeB = new Chromosome<number>([2, 3, 4, 5, 6])
        const fitness = identityArrayMatch.getFitness(chromosomeA, chromosomeB)
        expect(fitness.value).to.equal(0)
      })

      it('uses identity equality by default to compare genes', () => {
        const [A, B, C, D, E] = [{v: 'A'}, {v: 'B'}, {v: 'C'}, {v: 'D'}, {v: 'E'}]
        const chromosomeA = new Chromosome<typeof A>([A, B, C, D, E])
        const chromosomeB = new Chromosome<typeof A>([A, {...B}, C, {...D}, E])
        const fitness = identityArrayMatch.getFitness(chromosomeA, chromosomeB)
        expect(fitness.value).to.equal(3)
      })

      it('uses the optional .computeIsEqual function to determine equality', () => {
        const [A, B, C, D, E] = [{v: 'A'}, {v: 'B'}, {v: 'C'}, {v: 'D'}, {v: 'E'}]
        const chromosomeA = new Chromosome<typeof A>([A, B, C, D, E])
        const chromosomeB = new Chromosome<typeof A>([A, {...B}, C, {...D}, E])
        const specialArrayMatch = new ArrayMatch<typeof A>({
          computeIsEqual(geneA, geneB) {
            return geneA?.v === geneB?.v
          }
        })

        const fitness = specialArrayMatch.getFitness(chromosomeA, chromosomeB)
        expect(fitness.value).to.equal(5)
      })
    })

    describe('#getTargetFitness()', () => {
      it('sets the target value to the length of the given chromosome', () => {
        const chromosome = new Chromosome<number>([3, 4, 2, 5, 1])
        const fitness = identityArrayMatch.getTargetFitness(chromosome)
        expect(fitness.value).to.equal(5)
      })
    })
  })
})
