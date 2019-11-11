import { expect } from 'chai'

import { sentenceSplitter } from '.'

describe('sentenceSplitter', function () {
  it('splits sentences', function () {
    expect(sentenceSplitter("one. two? three... !")).to.deep.eq(['one.', 'two?', 'three.'])
  })
})
