import {expect} from 'chai'
import {SinonStub, spy, stub} from 'sinon'

import {Chromosome} from '../chromosomes'
import {NumberFitness} from '../fitness'
import {Propagation, PropagationConfig} from './propagation'
import {PropagationRecord} from './types'

describe('propagation', () => {
  describe('Propagation', () => {
    let config: PropagationConfig<number, number>
    let propagation: Propagation<number, number>

    beforeEach(() => {
      config = {
        optimalFitness: new NumberFitness(5),

        calculateFitness(chromosome: Chromosome<number>): NumberFitness {
          return new NumberFitness(chromosome.getGene(0)!)
        },

        generateParent(): Chromosome<number> {
          return new Chromosome<number>([0])
        },

        mutate(chromosome: Chromosome<number>): Chromosome<number> {
          const gene: number = chromosome.getGene(0)!
          return new Chromosome<number>([gene + 1])
        },

        onImprovement: stub<[record: PropagationRecord<number, number>], void>(),
        onIteration: stub<[record: PropagationRecord<number, number>], void>()
      }

      propagation = new Propagation<number, number>(config)
    })

    describe('#iteration', () => {
      it('is the number of times the propagation has iterated', () => {
        propagation.iterate()
        propagation.iterate()
        propagation.iterate()
        expect(propagation.iteration).to.equal(3)
      })

      it('is zero when the propagation has not iterated', () => {
        expect(propagation.iteration).to.equal(0)
      })
    })

    describe('#best', () => {
      it('is the initial propagation record when the propagation has only iterated once', () => {
        propagation.iterate()
        expect(propagation.best!.fitness.value).to.equal(0)
      })

      it('is the propagation record with the greatest fitness', () => {
        propagation.iterate()
        propagation.iterate()
        propagation.iterate()
        expect(propagation.best!.fitness.value).to.equal(2)
      })

      it('is null when the propagation has not iterated', () => {
        expect(propagation.best).to.equal(null)
      })
    })

    describe('#current', () => {
      it('is the initial propagation record when the propagation has only iterated once', () => {
        propagation.iterate()
        expect(propagation.current!.fitness.value).to.equal(0)
      })

      it('is null when the propagation has not iterated', () => {
        expect(propagation.current).to.equal(null)
      })

      it('can be the best propagation', () => {
        propagation.iterate()
        propagation.iterate()
        propagation.iterate()
        expect(propagation.current).to.equal(propagation.best)
      })

      it('can be less fit than the best propagation', () => {
        propagation.iterate()
        propagation.iterate()
        stub(config, 'mutate').returns(new Chromosome([0]))
        propagation.iterate()
        expect(propagation.current!.fitness.value).to.equal(0)
      })
    })

    describe('#hasReachedOptimalFitness', () => {
      it('is true when the current propagation record has the optimal fitness', () => {
        propagation.iterate()
        stub(config, 'mutate').returns(new Chromosome([5]))
        propagation.iterate()
        expect(propagation.hasReachedOptimalFitness).to.equal(true)
      })

      it('is false when the current propagation record has the optimal fitness', () => {
        expect(propagation.hasReachedOptimalFitness).to.equal(false)
      })

      it('is false when the propagation has not iterated', () => {
        expect(propagation.hasReachedOptimalFitness).to.equal(false)
      })
    })

    describe('#iterate()', () => {
      context('when the propagation has not yet iterated', () => {
        it('sets #iteration to 1', () => {
          propagation.iterate()
          expect(propagation.iteration).to.equal(1)
        })

        it('generates a parent chromosome', () => {
          const generateParentSpy = spy(config, 'generateParent')
          propagation.iterate()
          expect(generateParentSpy.callCount).to.equal(1)
        })

        it('sets the current propagation record', () => {
          propagation.iterate()
          expect(propagation.current).to.exist
        })

        context('when setting the current record', () => {
          it('sets the chromosome to the generated parent', () => {
            const chromosome = config.generateParent()
            stub(config, 'generateParent').returns(chromosome)
            propagation.iterate()
            expect(propagation.current!.chromosome).to.equal(chromosome)
          })

          it('sets the fitness', () => {
            stub(config, 'generateParent').returns(new Chromosome<number>([1]))
            propagation.iterate()
            expect(propagation.current!.fitness).to.deep.equal(new NumberFitness(1))
          })

          it('sets the iteration to the current propagation iteration', () => {
            propagation.iterate()
            expect(propagation.current!.iteration).to.equal(1)
          })
        })

        it('sets the best propagation record to the current record', () => {
          propagation.iterate()
          expect(propagation.best).to.equal(propagation.current)
        })

        it('calls the configured `onIteration` callback', () => {
          const onIterationStub = config.onIteration as SinonStub
          propagation.iterate()
          expect(onIterationStub.callCount).to.equal(1)
        })

        it('calls `onIteration` after setting #iteration', () => {
          ;(config.onIteration as SinonStub).callsFake(() => {
            expect(propagation.iteration).to.equal(1)
          })
          propagation.iterate()
        })

        it('calls `onIteration` after setting the current propagation record', () => {
          ;(config.onIteration as SinonStub).callsFake(() => {
            expect(propagation.current).to.exist
          })
          propagation.iterate()
        })

        it('calls `onIteration` with the current propagation record', () => {
          const onIterationStub = config.onIteration as SinonStub
          propagation.iterate()
          expect(onIterationStub.lastCall.args[0]).to.equal(propagation.current)
        })

        it('calls `onIteration` before setting the best propagation record', () => {
          ;(config.onIteration as SinonStub).callsFake(() => {
            expect(propagation.best).to.not.exist
          })
          propagation.iterate()
        })

        it('calls the configured `onImprovement` callback', () => {
          const onImprovementStub = config.onImprovement as SinonStub
          propagation.iterate()
          expect(onImprovementStub.callCount).to.equal(1)
        })

        it('calls `onImprovement` after setting the best propagation record', () => {
          ;(config.onImprovement as SinonStub).callsFake(() => {
            expect(propagation.best).to.exist
          })
          propagation.iterate()
        })

        it('calls `onImprovement` with the best propagation record', () => {
          const onImprovementStub = config.onImprovement as SinonStub
          propagation.iterate()
          expect(onImprovementStub.lastCall.args[0]).to.equal(propagation.best)
        })

        it('returns `true`', () => {
          expect(propagation.iterate()).to.equal(true)
        })
      })

      context('when the propagation has initially iterated', () => {
        beforeEach(() => {
          // Perform initial iteration; current fitness is zero.
          propagation.iterate()
        })

        it('increments #iteration', () => {
          const {iteration} = propagation
          propagation.iterate()
          expect(propagation.iteration).to.equal(iteration + 1)
        })

        it('calls the configured `mutate` method', () => {
          const mutateSpy = spy(config, 'mutate')
          propagation.iterate()
          expect(mutateSpy.callCount).to.equal(1)
        })

        it('calls `mutate` with the chromosome of the best propagation record', () => {
          const mutateStub = stub(config, 'mutate')
          mutateStub.returns(new Chromosome([3]))
          propagation.iterate() // current and best records have fitness of 3
          mutateStub.returns(new Chromosome([1]))
          propagation.iterate() // current has fitness of 1; best still has 3
          propagation.iterate()
          expect(mutateStub.lastCall.args[0]).to.equal(propagation.best!.chromosome)
        })

        it('updates the current propagation record', () => {
          propagation.iterate()
          expect(propagation.current).to.exist
        })

        context('when setting the current record', () => {
          it('sets the chromosome to the mutated chromosome', () => {
            const chromosome = config.generateParent()
            stub(config, 'mutate').returns(chromosome)
            propagation.iterate()
            expect(propagation.current!.chromosome).to.equal(chromosome)
          })

          it('sets the fitness', () => {
            stub(config, 'mutate').returns(new Chromosome([2]))
            propagation.iterate()
            expect(propagation.current!.fitness).to.deep.equal(new NumberFitness(2))
          })

          it('sets the iteration to the current propagation iteration', () => {
            propagation.iterate()
            expect(propagation.current!.iteration).to.equal(2)
          })
        })

        it('calls the configured `onIteration` callback', () => {
          const onIterationStub = config.onIteration as SinonStub
          onIterationStub.resetHistory()
          propagation.iterate()
          expect(onIterationStub.callCount).to.equal(1)
        })

        it('calls `onIteration` after incrementing #iteration', () => {
          const {iteration} = propagation
          ;(config.onIteration as SinonStub).callsFake(() => {
            expect(propagation.iteration).to.equal(iteration + 1)
          })
          propagation.iterate()
        })

        it('calls `onIteration` after updating the current propagation record', () => {
          const {current} = propagation
          ;(config.onIteration as SinonStub).callsFake(() => {
            expect(propagation.current).to.not.equal(current)
          })
          propagation.iterate()
        })

        it('calls `onIteration` with the current propagation record', () => {
          const onIterationStub = config.onIteration as SinonStub
          propagation.iterate()
          expect(onIterationStub.lastCall.args[0]).to.equal(propagation.current)
        })
      })

      context('when the iteration produces a more fit chromosome', () => {
        beforeEach(() => {
          // Perform initial iteration; current fitness is zero.
          propagation.iterate()
        })

        it('sets the best propagation record to the current record', () => {
          propagation.iterate()
          expect(propagation.best).to.equal(propagation.current)
        })

        it('sets the best record after calling `onIteration`', () => {
          const {best} = propagation
          ;(config.onIteration as SinonStub).callsFake(() => {
            expect(propagation.best).to.equal(best)
          })
          propagation.iterate()
        })

        it('calls the configured `onImprovement` callback', () => {
          const onImprovementStub = config.onImprovement as SinonStub
          onImprovementStub.resetHistory()
          propagation.iterate()
          expect(onImprovementStub.callCount).to.equal(1)
        })

        it('calls `onImprovement` after setting the best propagation record', () => {
          const {best} = propagation
          ;(config.onImprovement as SinonStub).callsFake(() => {
            expect(propagation.best).to.not.equal(best)
          })
          propagation.iterate()
        })

        it('calls `onImprovement` with the best propagation record', () => {
          const onImprovementStub = config.onImprovement as SinonStub
          propagation.iterate()
          expect(onImprovementStub.lastCall.args[0]).to.equal(propagation.best)
        })

        it('returns `true`', () => {
          expect(propagation.iterate()).to.equal(true)
        })
      })

      context('when the iteration produces a less fit chromosome', () => {
        beforeEach(() => {
          // Perform initial iteration; current fitness is zero.
          propagation.iterate()
          const stubbedMutate = stub(config, 'mutate').returns(new Chromosome([3]))
          propagation.iterate()
          stubbedMutate.returns(new Chromosome([2]))
        })

        it('does not change the best propagation record', () => {
          const {best} = propagation
          propagation.iterate()
          expect(propagation.best).to.equal(best)
        })

        it('does not call the configured `onImprovement` callback', () => {
          const onImprovementStub = config.onImprovement as SinonStub
          onImprovementStub.resetHistory()
          propagation.iterate()
          expect(onImprovementStub.callCount).to.equal(0)
        })

        it('returns `true`', () => {
          expect(propagation.iterate()).to.equal(true)
        })
      })

      context('when the iteration produces an equally-fit chromosome', () => {
        beforeEach(() => {
          // Perform initial iteration; current fitness is zero.
          propagation.iterate()
          stub(config, 'mutate').returns(new Chromosome([3]))
          propagation.iterate()
        })

        it('sets the best propagation record to the current record', () => {
          propagation.iterate()
          expect(propagation.best).to.equal(propagation.current)
        })

        it('sets the best record after calling `onIteration`', () => {
          const {best} = propagation
          ;(config.onIteration as SinonStub).callsFake(() => {
            expect(propagation.best).to.equal(best)
          })
          propagation.iterate()
        })

        it('does not call the configured `onImprovement` callback', () => {
          const onImprovementStub = config.onImprovement as SinonStub
          onImprovementStub.resetHistory()
          propagation.iterate()
          expect(onImprovementStub.callCount).to.equal(0)
        })

        it('returns `true`', () => {
          expect(propagation.iterate()).to.equal(true)
        })
      })

      context('when the propagation has already reached optimal fitness', () => {
        beforeEach(() => {
          propagation.iterate()
          const stubbedMutate = stub(config, 'mutate').returns(new Chromosome([5]))
          propagation.iterate()
          stubbedMutate.restore()
        })

        it('does not change the best record', () => {
          const {best} = propagation
          propagation.iterate()
          expect(propagation.best).to.equal(best)
        })

        it('does not change the current record', () => {
          const {current} = propagation
          propagation.iterate()
          expect(propagation.current).to.equal(current)
        })

        it('returns `false`', () => {
          expect(propagation.iterate()).to.equal(false)
        })
      })
    })
  })
})
