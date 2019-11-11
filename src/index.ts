import { Transform, Duplex } from 'stream'
import { isProper } from './is-proper'
import { sentenceSplitter } from './sentence-splitter'

export {
  isProper,
  sentenceSplitter
}

export type MarkovBuilder = Duplex

export type MarkovNgram = {
  // list of the words in this ngram
  ngram: string[],
  // is this a sentence starter?
  sentenceStart: boolean,
  // is this a sentence ender?
  sentenceEnd: boolean,
  // is ngram[0] proper?
  startsWithProper: boolean
}

export type MarkovOpts = {
  // number of "context words" to add to each individual word
  // default: 1
  order: number

  // return true if this `word` should be considered 'proper'
  isProperFn: (word: string) => boolean

  // given a single line, return a list of sub-sentences
  sentenceSplitterFn: (line: string) => string[]
}

export function MarkovBuilder(inOpts: Partial<MarkovOpts> = {}): MarkovBuilder {
  const opts: MarkovOpts = {
    order: inOpts.order || 1,
    isProperFn: inOpts.isProperFn || isProper,
    sentenceSplitterFn: inOpts.sentenceSplitterFn || sentenceSplitter
  }

  function getNgrams(sentence: string): MarkovNgram[] {
    return sentence
    .split(/\s/)
    .filter(e => e)
    .map((startWord, i, words) => {
      if (i >= words.length - opts.order) {
        return
      }

      const ngram = [startWord]
      let j = 1;

      while(j <= opts.order && i + j < words.length) {
        ngram.push(words[i + j])
        j++
      }

      return {
        ngram,
        sentenceStart: i === 0,
        sentenceEnd: i === words.length - opts.order - 1,
        startsWithProper: opts.isProperFn(startWord)
      }
    })
    .filter(e => e) as MarkovNgram[]
  }

  // @ts-ignore
  return new Transform({
    writableObjectMode: false,
    readableObjectMode: true,
    transform (rawChunk: Buffer | string, _encoding, cb) {
      try {
        const chunk = typeof rawChunk === 'string' ? rawChunk : String(rawChunk)

        chunk
        .split('\n')
        .map(line => line.trim()) // remove leading/trailing whitespace
        .filter(x => x) // remove blank lines
        .forEach(line => {
          opts
          .sentenceSplitterFn(line)
          .map(getNgrams)
          .forEach(ngrams => {
            ngrams.forEach(ngram => {
              this.push(ngram)
            })
          })
        })

        cb()
      } catch (e) {
        cb(e)
      }
    }
  })
}
