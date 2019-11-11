# streaming-markov-chain-builder

[![Gitlab pipeline status (self-hosted)][ci-badge]][ci]
[![npm bundle size][size-badge]][npm]
[![npm][npm-badge]][npm]

[`streaming-markov-chain-builder`][npm] is a Markov chain builder that accepts input text as a stream and outputs a stream of n-grams.

https://devdocs.io/node/stream#stream_class_stream_transform

## Installation

```shell
npm i --save streaming-markov-chain-builder
```

## Usage

```js
const { MarkovBuilder } = require('streaming-markov-chain-builder')

const builder = MarkovBuilder({
  // number of "context words" to add to each individual word
  // defaults to 1
  order: 1

  // optional - return true if this `word` should be considered 'proper'
  // see `src/is-proper.ts` for the default implementation, exported as { isProperFn }
  isProperFn: (word) => { return _.isUpperCase(word[0]) }

  // optional - given a single line, return a list of sub-sentences
  // see `src/sentence-splitter.ts` for the default implementation, exported as { sentenceSplitterFn }
  sentenceSplitterFn: (line) => { return line.split(/[\.\?!]/g) }
})

// now, you can start ingesting data by writing it...
builder.write('the quick brown fox jumped over the lazy dog')

// or by streaming it in from a file...
fs.createReadStream('/tmp/corpus.txt').pipe(builder)

// since MarkovBuilder is a Transform stream, you can consume the output by reading from it...
builder.on('data', (ngram) => {
  // see below for structure of the `ngram`
})

// you can also pipe the Transform stream to a consumer that accepts object-mode streams
builder.pipe(storage)
```

[ci-badge]: https://img.shields.io/gitlab/pipeline/flotwig/node-streaming-markov-chain-builder?gitlab_url=https%3A%2F%2Fci.chary.us
[ci]: https://ci.chary.us/flotwig/node-streaming-markov-chain-builder/pipelines
[size-badge]: https://img.shields.io/bundlephobia/min/streaming-markov-chain-builder
[npm-badge]: https://img.shields.io/npm/v/streaming-markov-chain-builder
[npm]: https://www.npmjs.com/package/streaming-markov-chain-builder
