import {expect} from 'chai'

import {Chromosome} from '../chromosomes'
import {ArrayOrder, ArrayOrderFitness} from './array-order'

describe('fitness > array order', () => {
  describe('ArrayOrderFitness', () => {
    describe('#value', () => {
      it('represents the values given at instantiation', () => {
        const fitness = new ArrayOrderFitness(10, 5)
        expect(fitness.value).to.deep.equal({gap: 5, ordered: 10})
      })
    })

    describe('#isEqualTo()', () => {
      it('returns true when the compared fitness has equal .ordered and .gap', () => {
        const fitnessA = new ArrayOrderFitness(10, 5)
        const fitnessB = new ArrayOrderFitness(10, 5)
        expect(fitnessA.isEqualTo(fitnessB)).to.equal(true)
      })

      it('returns false when the compared fitness has a different .ordered', () => {
        const fitnessA = new ArrayOrderFitness(10, 5)
        const fitnessB = new ArrayOrderFitness(11, 5)
        expect(fitnessA.isEqualTo(fitnessB)).to.equal(false)
      })

      it('returns false when the compared fitness has a different .gap', () => {
        const fitnessA = new ArrayOrderFitness(10, 5)
        const fitnessB = new ArrayOrderFitness(10, 6)
        expect(fitnessA.isEqualTo(fitnessB)).to.equal(false)
      })
    })

    describe('#isGreaterThan()', () => {
      it('returns true when the compared fitness has a lower .ordered and equal .gap', () => {
        const fitnessA = new ArrayOrderFitness(10, 5)
        const fitnessB = new ArrayOrderFitness(9, 5)
        expect(fitnessA.isGreaterThan(fitnessB)).to.equal(true)
      })

      it('returns false when the compared fitness has a higher .ordered and equal .gap', () => {
        const fitnessA = new ArrayOrderFitness(10, 5)
        const fitnessB = new ArrayOrderFitness(11, 5)
        expect(fitnessA.isGreaterThan(fitnessB)).to.equal(false)
      })

      it('returns false when the compared fitness has equal .ordered and .gap', () => {
        const fitnessA = new ArrayOrderFitness(10, 5)
        const fitnessB = new ArrayOrderFitness(10, 5)
        expect(fitnessA.isGreaterThan(fitnessB)).to.equal(false)
      })

      it('returns true when the compared fitness has an equal .ordered and higher .gap', () => {
        const fitnessA = new ArrayOrderFitness(10, 5)
        const fitnessB = new ArrayOrderFitness(10, 6)
        expect(fitnessA.isGreaterThan(fitnessB)).to.equal(true)
      })

      it('returns false when the compared fitness has an equal .ordered and lower .gap', () => {
        const fitnessA = new ArrayOrderFitness(10, 5)
        const fitnessB = new ArrayOrderFitness(10, 4)
        expect(fitnessA.isGreaterThan(fitnessB)).to.equal(false)
      })
    })

    describe('#isLessThan()', () => {
      it('returns true when the compared fitness has a higher .ordered and equal .gap', () => {
        const fitnessA = new ArrayOrderFitness(10, 5)
        const fitnessB = new ArrayOrderFitness(11, 5)
        expect(fitnessA.isLessThan(fitnessB)).to.equal(true)
      })

      it('returns false when the compared fitness has a lower .ordered and equal .gap', () => {
        const fitnessA = new ArrayOrderFitness(10, 5)
        const fitnessB = new ArrayOrderFitness(9, 5)
        expect(fitnessA.isLessThan(fitnessB)).to.equal(false)
      })

      it('returns false when the compared fitness has equal .ordered and .gap', () => {
        const fitnessA = new ArrayOrderFitness(10, 5)
        const fitnessB = new ArrayOrderFitness(10, 5)
        expect(fitnessA.isLessThan(fitnessB)).to.equal(false)
      })

      it('returns true when the compared fitness has an equal .ordered and lower .gap', () => {
        const fitnessA = new ArrayOrderFitness(10, 5)
        const fitnessB = new ArrayOrderFitness(10, 4)
        expect(fitnessA.isLessThan(fitnessB)).to.equal(true)
      })

      it('returns false when the compared fitness has an equal .ordered and higher .gap', () => {
        const fitnessA = new ArrayOrderFitness(10, 5)
        const fitnessB = new ArrayOrderFitness(10, 6)
        expect(fitnessA.isLessThan(fitnessB)).to.equal(false)
      })
    })
  })

  describe('ArrayOrder', () => {
    const ascendingArrayOrder = new ArrayOrder()

    describe('#getFitness()', () => {
      it('sets the fitness .ordered to the number of genes in order', () => {
        const chromosome = new Chromosome<number>([3, 4, 2, 5, 1])
        const fitness = ascendingArrayOrder.getFitness(chromosome)
        expect(fitness.value.ordered).to.equal(3)
      })

      it('sets .ordered to the array length when all genes are in order', () => {
        const chromosome = new Chromosome<number>([1, 2, 3, 4, 5])
        const fitness = ascendingArrayOrder.getFitness(chromosome)
        expect(fitness.value.ordered).to.equal(5)
      })

      it('sets .ordered to 1 when all genes are in reverse order', () => {
        // The first entry in the array is always "in order."
        const chromosome = new Chromosome<number>([5, 4, 3, 2, 1])
        const fitness = ascendingArrayOrder.getFitness(chromosome)
        expect(fitness.value.ordered).to.equal(1)
      })

      it('uses the optional .computeIsOrdered function to determine order', () => {
        const descendingArrayOrder = new ArrayOrder({
          computeIsOrdered(previousGene, nextGene) {
            return previousGene >= nextGene
          }
        })

        const chromosome = new Chromosome<number>([5, 4, 3, 2, 1])
        const fitness = descendingArrayOrder.getFitness(chromosome)
        expect(fitness.value.ordered).to.equal(5)
      })

      it('sets fitness .gap to the sum of the differences between adjacent, out-of-order genes', () => {
        const chromosome = new Chromosome<number>([10, 6, 3, 4, 5])
        const fitness = ascendingArrayOrder.getFitness(chromosome)
        // (10 - 6 = 4) + (6 - 3 = 3) => 7
        expect(fitness.value.gap).to.equal(7)
      })

      it('sets .gap to 0 when all genes are in order', () => {
        const chromosome = new Chromosome<number>([1, 3, 5, 7, 9])
        const fitness = ascendingArrayOrder.getFitness(chromosome)
        expect(fitness.value.gap).to.equal(0)
      })

      it('uses the optional .computeGap function to measure gaps', () => {
        const squaredGap = new ArrayOrder({
          computeGap(previousGene, nextGene) {
            return (+previousGene - +nextGene) ** 2
          }
        })

        const chromosome = new Chromosome<number>([10, 6, 3, 4, 5])
        const fitness = squaredGap.getFitness(chromosome)
        // ((10 - 6) ^2 = 16) + ((6 - 3) ^2 = 9) => 25
        expect(fitness.value.gap).to.equal(25)
      })

      it('also determines order for string values', () => {
        const chromosome = new Chromosome<string>(['C', 'D', 'B', 'E', 'A'])
        const fitness = ascendingArrayOrder.getFitness(chromosome)
        expect(fitness.value.ordered).to.equal(3)
      })

      it('also measures gaps for string values', () => {
        const chromosome = new Chromosome<string>(['J', 'F', 'C', 'D', 'E'])
        const fitness = ascendingArrayOrder.getFitness(chromosome)
        expect(fitness.value.gap).to.equal(7)
      })
    })

    describe('#getTargetFitness()', () => {
      it('sets the target .ordered to the length of the given chromosome', () => {
        const chromosome = new Chromosome<number>([3, 4, 2, 5, 1])
        const fitness = ascendingArrayOrder.getTargetFitness(chromosome)
        expect(fitness.value.ordered).to.equal(5)
      })

      it('sets the target .gap to 0', () => {
        const chromosome = new Chromosome<number>([3, 4, 2, 5, 1])
        const fitness = ascendingArrayOrder.getTargetFitness(chromosome)
        expect(fitness.value.gap).to.equal(0)
      })
    })
  })
})
