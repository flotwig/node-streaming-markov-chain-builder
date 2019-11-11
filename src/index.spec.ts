
import { MarkovBuilder, MarkovNgram } from '.'

describe('MarkovBuilder', function () {
  [1, 2].forEach(order => {
    it(`emits expected ngrams with order ${order}`, function () {
      const builder = MarkovBuilder({
        order
      })

      const ngrams: MarkovNgram[] = []

      builder.on('data', (ngram: MarkovNgram) => {
        ngrams.push(ngram)
      })

      builder.write('hello world')
      builder.write('')
      builder.write('D;')
      builder.write('.bang')
      builder.write('try except is great')
      builder.write('i cant believe youve done this')
      builder.write('good afternoon, gentlemen')
      builder.write('.bang')
      builder.write('first snowstorm of the year, time to watch The Shining!')
      builder.write('snowed here too')
      builder.write('starting to accumulate at all?')

      expect(ngrams).toMatchSnapshot()
    })
  })
})
