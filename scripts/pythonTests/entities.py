#!/usr/bin/env python

import sys
import nltk

input = sys.argv[1]

tokens = nltk.word_tokenize(input)
tagged = nltk.pos_tag(tokens)
entities = nltk.chunk.ne_chunk(tagged)
print entities