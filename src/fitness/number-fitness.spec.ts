import {expect} from 'chai'

import {NumberFitness} from './number-fitness'

describe('fitness > number fitness', () => {
  describe('NumberFitness', () => {
    describe('#value', () => {
      it('is the value given at instantiation', () => {
        const fitness = new NumberFitness(123)
        expect(fitness.value).to.equal(123)
      })
    })

    describe('#isEqualTo()', () => {
      it('returns true when the compared fitness has an equal value', () => {
        const fitnessA = new NumberFitness(123)
        const fitnessB = new NumberFitness(123)
        expect(fitnessA.isEqualTo(fitnessB)).to.equal(true)
      })

      it('returns false when the compared fitness has a different value', () => {
        const fitnessA = new NumberFitness(123)
        const fitnessB = new NumberFitness(124)
        expect(fitnessA.isEqualTo(fitnessB)).to.equal(false)
      })
    })

    describe('#isGreaterThan()', () => {
      it('returns true when the compared fitness has a lower value', () => {
        const fitnessA = new NumberFitness(123)
        const fitnessB = new NumberFitness(122)
        expect(fitnessA.isGreaterThan(fitnessB)).to.equal(true)
      })

      it('returns false when the compared fitness has an equal value', () => {
        const fitnessA = new NumberFitness(123)
        const fitnessB = new NumberFitness(123)
        expect(fitnessA.isGreaterThan(fitnessB)).to.equal(false)
      })

      it('returns false when the compared fitness has a higher value', () => {
        const fitnessA = new NumberFitness(123)
        const fitnessB = new NumberFitness(124)
        expect(fitnessA.isGreaterThan(fitnessB)).to.equal(false)
      })

      context('when higher numbers are not considered greater', () => {
        it('returns false when the compared fitness has a lower value', () => {
          const fitnessA = new NumberFitness(123, false)
          const fitnessB = new NumberFitness(122)
          expect(fitnessA.isGreaterThan(fitnessB)).to.equal(false)
        })

        it('returns false when the compared fitness has an equal value', () => {
          const fitnessA = new NumberFitness(123, false)
          const fitnessB = new NumberFitness(123)
          expect(fitnessA.isGreaterThan(fitnessB)).to.equal(false)
        })

        it('returns true when the compared fitness has a higher value', () => {
          const fitnessA = new NumberFitness(123, false)
          const fitnessB = new NumberFitness(124)
          expect(fitnessA.isGreaterThan(fitnessB)).to.equal(true)
        })
      })
    })

    describe('#isLessThan()', () => {
      it('returns true when the compared fitness has a higher value', () => {
        const fitnessA = new NumberFitness(123)
        const fitnessB = new NumberFitness(124)
        expect(fitnessA.isLessThan(fitnessB)).to.equal(true)
      })

      it('returns false when the compared fitness has an equal value', () => {
        const fitnessA = new NumberFitness(123)
        const fitnessB = new NumberFitness(123)
        expect(fitnessA.isLessThan(fitnessB)).to.equal(false)
      })

      it('returns false when the compared fitness has a lower value', () => {
        const fitnessA = new NumberFitness(123)
        const fitnessB = new NumberFitness(122)
        expect(fitnessA.isLessThan(fitnessB)).to.equal(false)
      })

      context('when higher numbers are not considered greater', () => {
        it('returns false when the compared fitness has a higher value', () => {
          const fitnessA = new NumberFitness(123, false)
          const fitnessB = new NumberFitness(124)
          expect(fitnessA.isLessThan(fitnessB)).to.equal(false)
        })

        it('returns false when the compared fitness has an equal value', () => {
          const fitnessA = new NumberFitness(123, false)
          const fitnessB = new NumberFitness(123)
          expect(fitnessA.isLessThan(fitnessB)).to.equal(false)
        })

        it('returns true when the compared fitness has a lower value', () => {
          const fitnessA = new NumberFitness(123, false)
          const fitnessB = new NumberFitness(122)
          expect(fitnessA.isLessThan(fitnessB)).to.equal(true)
        })
      })
    })
  })
})
