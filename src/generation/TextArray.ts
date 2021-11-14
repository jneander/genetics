import {Chromosome} from '../chromosomes'
import {FitnessCalculator} from '../fitness'
import {randomEntry} from '../util'

function createPhraseArray(length: number, geneSet: string[]) {
  const phrase = []
  for (let i = 0; i < length; i++) {
    phrase.push(randomEntry(geneSet))
  }
  return phrase
}

export default class TextArray {
  protected geneSet: string[]
  protected fitnessMethod: FitnessCalculator<string, number>

  constructor(geneSet: string[], fitnessMethod: FitnessCalculator<string, number>) {
    this.geneSet = geneSet
    this.fitnessMethod = fitnessMethod
  }

  generateTargetWithLength(length: number): Chromosome<string, number> {
    const targetArray = createPhraseArray(length, this.geneSet)
    const target = new Chromosome<string, number>(targetArray, 0)
    target.fitness = this.fitnessMethod.getTargetFitness(target)

    return target
  }
}
